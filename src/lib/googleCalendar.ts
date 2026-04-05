import { google, calendar_v3 } from "googleapis";
import { getDb } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { randomUUID } from "crypto";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export const BUSINESS_TIMEZONE = "America/New_York";

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl() {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

export async function exchangeCode(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function getAuthedClient(userId: string) {
  const db = getDb();
  const token = await db.googleCalendarToken.findUnique({ where: { userId } });
  if (!token) return null;

  const client = getOAuth2Client();
  client.setCredentials({
    access_token: decrypt(token.accessToken),
    refresh_token: decrypt(token.refreshToken),
    expiry_date: token.expiresAt.getTime(),
  });

  // Refresh if expired
  if (token.expiresAt.getTime() < Date.now()) {
    const { credentials } = await client.refreshAccessToken();
    await db.googleCalendarToken.update({
      where: { userId },
      data: {
        accessToken: encrypt(credentials.access_token!),
        expiresAt: new Date(credentials.expiry_date!),
      },
    });
    client.setCredentials(credentials);
  }

  return { client, calendarId: token.calendarId };
}

type LeadForEvent = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  vehicleType?: string | null;
  preferredDate?: string | null;
  address?: string | null;
  notes?: string | null;
  service?: { name: string; durationMins: number } | null;
};

export async function createCalendarEvent(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  lead: LeadForEvent
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  const durationMins = lead.service?.durationMins ?? 120;

  // Parse preferred date in business timezone
  const startDate = parsePreferredDate(lead.preferredDate);
  const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);

  const event: calendar_v3.Schema$Event = {
    summary: `Detail: ${lead.name} - ${lead.service?.name ?? "Service"}`,
    description: [
      `Client: ${lead.name}`,
      `Phone: ${lead.phone}`,
      lead.email ? `Email: ${lead.email}` : "",
      lead.vehicleType ? `Vehicle: ${lead.vehicleType}` : "",
      lead.address ? `Address: ${lead.address}` : "",
      lead.notes ? `Notes: ${lead.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: startDate.toISOString(), timeZone: BUSINESS_TIMEZONE },
    end: { dateTime: endDate.toISOString(), timeZone: BUSINESS_TIMEZONE },
    ...(lead.address ? { location: lead.address } : {}),
  };

  const res = await calendar.events.insert({
    calendarId: authedClient.calendarId,
    requestBody: event,
  });

  return res.data;
}

export async function updateCalendarEvent(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  eventId: string,
  data: Partial<calendar_v3.Schema$Event>
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  const res = await calendar.events.patch({
    calendarId: authedClient.calendarId,
    eventId,
    requestBody: data,
  });
  return res.data;
}

export async function deleteCalendarEvent(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  eventId: string
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  await calendar.events.delete({
    calendarId: authedClient.calendarId,
    eventId,
  });
}

/** Business hours window per day, with summer expansion */
function getBusinessHours(day: number, dateStr: string): { startHour: number; endHour: number } {
  const isExpanded = dateStr >= "2026-05-30";
  switch (day) {
    case 0: return { startHour: 10, endHour: 18 }; // Sunday 10am-6pm
    case 6: return { startHour: 8, endHour: 18 };   // Saturday 8am-6pm
    default: return isExpanded
      ? { startHour: 8, endHour: 18 }               // Mon-Fri (summer) 8am-6pm
      : { startHour: 15, endHour: 18 };              // Mon-Fri (school year) 3pm-6pm
  }
}

export async function getAvailableSlots(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  date: string,
  _durationMins: number
) {
  const dateObj = new Date(`${date}T12:00:00`);
  const hours = getBusinessHours(dateObj.getDay(), date);

  const MIN_SLOT_MS = 2 * 60 * 60 * 1000; // need at least 2 hours free
  const STEP_MS = 30 * 60 * 1000;          // 30-minute increments

  const dayStart = toTimezoneDate(
    `${date}T${String(hours.startHour).padStart(2, "0")}:00:00`,
    BUSINESS_TIMEZONE
  );
  const dayEnd = toTimezoneDate(
    `${date}T${String(hours.endHour).padStart(2, "0")}:00:00`,
    BUSINESS_TIMEZONE
  );

  // Query Google Calendar for busy periods
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: BUSINESS_TIMEZONE,
      items: [{ id: authedClient.calendarId }],
    },
  });

  const busySlots =
    res.data.calendars?.[authedClient.calendarId]?.busy ?? [];

  const slots: { start: string; end: string }[] = [];

  // Walk in 30-min steps; only offer a slot if the full 2-hour window is clear
  for (
    let t = dayStart.getTime();
    t + MIN_SLOT_MS <= dayEnd.getTime();
    t += STEP_MS
  ) {
    const slotEnd = t + MIN_SLOT_MS;
    const overlaps = busySlots.some((busy) => {
      const bs = new Date(busy.start!).getTime();
      const be = new Date(busy.end!).getTime();
      return t < be && slotEnd > bs;
    });

    if (!overlaps) {
      slots.push({
        start: new Date(t).toISOString(),
        end: new Date(slotEnd).toISOString(),
      });
    }
  }

  return slots;
}

export async function registerWatch(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {}
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  const channelId = randomUUID();

  const webhookUrl = process.env.NEXTAUTH_URL
    ? `${process.env.NEXTAUTH_URL}/api/admin/calendar/webhook`
    : null;

  if (!webhookUrl) throw new Error("NEXTAUTH_URL required for webhook registration");

  const res = await calendar.events.watch({
    calendarId: authedClient.calendarId,
    requestBody: {
      id: channelId,
      type: "web_hook",
      address: webhookUrl,
      expiration: String(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return {
    channelId: res.data.id!,
    resourceId: res.data.resourceId!,
    expiration: new Date(Number(res.data.expiration!)),
  };
}

export async function stopWatch(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  channelId: string,
  resourceId: string
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });
  await calendar.channels.stop({
    requestBody: { id: channelId, resourceId },
  });
}

/**
 * Convert a local datetime string (e.g. "2026-04-11T09:00:00") to a Date
 * that represents that wall-clock time in the given IANA timezone.
 */
function toTimezoneDate(localDatetime: string, tz: string): Date {
  // Format a known date in the target tz to find the UTC offset
  const probe = new Date(localDatetime + "Z");
  const inTz = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(probe);

  const get = (type: string) => inTz.find((p) => p.type === type)?.value ?? "0";
  const tzTime = new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}Z`
  );
  const offsetMs = tzTime.getTime() - probe.getTime();

  // Parse the local datetime and shift by the offset
  const local = new Date(localDatetime);
  return new Date(local.getTime() - offsetMs);
}

function parsePreferredDate(preferredDate?: string | null): Date {
  if (!preferredDate) return getDefaultStart();

  const now = new Date();
  const currentYear = now.getFullYear();

  // Try formats: "MM/DD", "MM/DD at HH:MM AM", "MM/DD/YYYY", "YYYY-MM-DD", etc.
  const cleaned = preferredDate.trim();

  // "MM/DD at HH:MM AM/PM"
  const atMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\s+at\s+(.+)$/i);
  if (atMatch) {
    const dateStr = `${currentYear}-${atMatch[1].padStart(2, "0")}-${atMatch[2].padStart(2, "0")}`;
    const timeStr = parseTimeString(atMatch[3]);
    return toTimezoneDate(`${dateStr}T${timeStr}`, BUSINESS_TIMEZONE);
  }

  // "MM/DD/YYYY"
  const fullDateMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (fullDateMatch) {
    const dateStr = `${fullDateMatch[3]}-${fullDateMatch[1].padStart(2, "0")}-${fullDateMatch[2].padStart(2, "0")}`;
    return toTimezoneDate(`${dateStr}T09:00:00`, BUSINESS_TIMEZONE);
  }

  // "MM/DD"
  const shortDateMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (shortDateMatch) {
    const dateStr = `${currentYear}-${shortDateMatch[1].padStart(2, "0")}-${shortDateMatch[2].padStart(2, "0")}`;
    return toTimezoneDate(`${dateStr}T09:00:00`, BUSINESS_TIMEZONE);
  }

  // ISO format or other parseable string
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) return parsed;

  return getDefaultStart();
}

function parseTimeString(timeStr: string): string {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return "09:00:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3]?.toUpperCase();

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

function getDefaultStart(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];
  return toTimezoneDate(`${dateStr}T09:00:00`, BUSINESS_TIMEZONE);
}
