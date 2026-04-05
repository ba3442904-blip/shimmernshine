import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { getAuthedClient, registerWatch, stopWatch } from "@/lib/googleCalendar";

export async function POST() {
  const db = getDb();
  const tokens = await db.googleCalendarToken.findMany();

  for (const token of tokens) {
    try {
      const authed = await getAuthedClient(token.userId);
      if (!authed) continue;

      // Stop existing watch if any
      if (token.channelId && token.resourceId) {
        try {
          await stopWatch(authed, token.channelId, token.resourceId);
        } catch {
          // May already be expired
        }
      }

      // Register new watch
      const watch = await registerWatch(authed);
      await db.googleCalendarToken.update({
        where: { id: token.id },
        data: {
          channelId: watch.channelId,
          resourceId: watch.resourceId,
          channelExpiry: watch.expiration,
        },
      });
    } catch {
      // Continue with other tokens
    }
  }

  return NextResponse.json({ ok: true });
}
