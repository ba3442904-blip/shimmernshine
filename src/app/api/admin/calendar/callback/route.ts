import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { exchangeCode } from "@/lib/googleCalendar";
import { encrypt } from "@/lib/encryption";
import { getDb } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/admin/calendar?error=no_code", req.url));
  }

  try {
    const tokens = await exchangeCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/admin/calendar?error=missing_tokens", req.url)
      );
    }

    const db = getDb();
    await db.googleCalendarToken.upsert({
      where: { userId: session.user.id },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600_000),
      },
      create: {
        userId: session.user.id,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        expiresAt: new Date(tokens.expiry_date ?? Date.now() + 3600_000),
      },
    });

    return NextResponse.redirect(new URL("/admin/calendar?connected=1", req.url));
  } catch {
    return NextResponse.redirect(
      new URL("/admin/calendar?error=exchange_failed", req.url)
    );
  }
}
