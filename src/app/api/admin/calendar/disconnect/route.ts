import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getAuthedClient, stopWatch } from "@/lib/googleCalendar";
import { getDb } from "@/lib/prisma";

export async function POST() {
  const session = await requireAdmin();
  const db = getDb();

  const token = await db.googleCalendarToken.findUnique({
    where: { userId: session.user.id },
  });

  if (token) {
    // Stop any active watch
    if (token.channelId && token.resourceId) {
      try {
        const authed = await getAuthedClient(session.user.id);
        if (authed) {
          await stopWatch(authed, token.channelId, token.resourceId);
        }
      } catch {
        // Best effort — channel may already be expired
      }
    }

    // Revoke the token
    try {
      const authed = await getAuthedClient(session.user.id);
      if (authed) {
        await authed.client.revokeToken(
          (authed.client.credentials.access_token as string) ?? ""
        );
      }
    } catch {
      // Best effort
    }

    await db.googleCalendarToken.delete({ where: { userId: session.user.id } });
  }

  return NextResponse.json({ ok: true });
}
