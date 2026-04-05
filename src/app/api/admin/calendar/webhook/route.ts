import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getDb } from "@/lib/prisma";
import { getAuthedClient } from "@/lib/googleCalendar";

export async function POST(req: NextRequest) {
  const channelId = req.headers.get("x-goog-channel-id");
  const resourceState = req.headers.get("x-goog-resource-state");

  if (!channelId || resourceState === "sync") {
    // Initial sync notification — acknowledge
    return NextResponse.json({ ok: true });
  }

  const db = getDb();

  // Find the token matching this channel
  const token = await db.googleCalendarToken.findFirst({
    where: { channelId },
  });

  if (!token) {
    return NextResponse.json({ error: "Unknown channel" }, { status: 404 });
  }

  try {
    const authed = await getAuthedClient(token.userId);
    if (!authed) {
      return NextResponse.json({ error: "Auth failed" }, { status: 500 });
    }

    const calendar = google.calendar({ version: "v3", auth: authed.client });

    // Get recent changes using sync token or recent events
    const eventsRes = await calendar.events.list({
      calendarId: authed.calendarId,
      updatedMin: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: "updated",
    });

    const events = eventsRes.data.items ?? [];

    for (const event of events) {
      if (!event.id) continue;

      const calEvent = await db.calendarEvent.findUnique({
        where: { googleEventId: event.id },
        include: { lead: true },
      });

      if (!calEvent) continue;

      if (event.status === "cancelled") {
        // Event was deleted in Google — update lead status
        await db.lead.update({
          where: { id: calEvent.leadId },
          data: { status: "contacted" },
        });
        await db.calendarEvent.delete({ where: { id: calEvent.id } });
      } else if (event.start?.dateTime) {
        // Event was rescheduled — update lead preferred date
        const newDate = new Date(event.start.dateTime);
        await db.lead.update({
          where: { id: calEvent.leadId },
          data: {
            preferredDate: newDate.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
          },
        });
        await db.calendarEvent.update({
          where: { id: calEvent.id },
          data: { syncedAt: new Date() },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
