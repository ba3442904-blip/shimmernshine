import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { getAuthedClient, getAvailableSlots } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const durationMins = Number(req.nextUrl.searchParams.get("durationMins")) || 120;

  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  const db = getDb();
  const token = await db.googleCalendarToken.findFirst();

  if (!token) {
    return NextResponse.json({ error: "Calendar not connected" }, { status: 404 });
  }

  try {
    const authed = await getAuthedClient(token.userId);
    if (!authed) {
      return NextResponse.json({ error: "Calendar not connected" }, { status: 404 });
    }

    const slots = await getAvailableSlots(authed, date, durationMins);
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
