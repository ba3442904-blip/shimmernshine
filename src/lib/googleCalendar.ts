import { google, calendar_v3 } from "googleapis";
import { getDb } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { randomUUID } from "crypto";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

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

  // Parse preferred date or default to tomorrow at 9am
  let startTime: Date;
  if (lead.preferredDate) {
    const parsed = new Date(lead.preferredDate);
    startTime = isNaN(parsed.getTime())
      ? getDefaultStart()
      : parsed;
  } else {
    startTime = getDefaultStart();
  }

  const endTime = new Date(startTime.getTime() + durationMins * 60 * 1000);

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
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
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

export async function getAvailableSlots(
  authedClient: Awaited<ReturnType<typeof getAuthedClient>> & {},
  date: string,
  durationMins: number
) {
  const calendar = google.calendar({ version: "v3", auth: authedClient.client });

  const dayStart = new Date(`${date}T08:00:00`);
  const dayEnd = new Date(`${date}T18:00:00`);

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: authedClient.calendarId }],
    },
  });

  const busySlots =
    res.data.calendars?.[authedClient.calendarId]?.busy ?? [];

  // Generate 30-minute interval slots from 8am to 6pm
  const slots: { start: string; end: string }[] = [];
  const slotDuration = durationMins * 60 * 1000;

  for (
    let time = dayStart.getTime();
    time + slotDuration <= dayEnd.getTime();
    time += 30 * 60 * 1000
  ) {
    const slotStart = new Date(time);
    const slotEnd = new Date(time + slotDuration);

    const isBusy = busySlots.some((busy) => {
      const busyStart = new Date(busy.start!).getTime();
      const busyEnd = new Date(busy.end!).getTime();
      return slotStart.getTime() < busyEnd && slotEnd.getTime() > busyStart;
    });

    if (!isBusy) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
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

function getDefaultStart() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  return tomorrow;
}
