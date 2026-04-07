import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getDb } from "@/lib/prisma";
import { getAuthedClient } from "@/lib/googleCalendar";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const year = Number(req.nextUrl.searchParams.get("year"));
  const month = Number(req.nextUrl.searchParams.get("month")); // 0-based

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: "year and month required" }, { status: 400 });
  }

  const db = getDb();
  const token = await db.googleCalendarToken.findFirst();
  if (!token) {
    return NextResponse.json({ error: "Calendar not connected" }, { status: 404 });
  }

  const authed = await getAuthedClient(token.userId);
  if (!authed) {
    return NextResponse.json({ error: "Calendar not connected" }, { status: 404 });
  }

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const calendar = google.calendar({ version: "v3", auth: authed.client });
  const res = await calendar.events.list({
    calendarId: authed.calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
  });

  const events = (res.data.items ?? []).map((e) => ({
    id: e.id,
    summary: e.summary ?? "(No title)",
    start: e.start?.dateTime ?? e.start?.date ?? null,
    end: e.end?.dateTime ?? e.end?.date ?? null,
    allDay: !e.start?.dateTime,
    colorId: e.colorId ?? null,
    htmlLink: e.htmlLink ?? null,
  }));

  return NextResponse.json({ events });
}
