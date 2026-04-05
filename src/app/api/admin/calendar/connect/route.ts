import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getAuthUrl } from "@/lib/googleCalendar";

export async function GET() {
  await requireAdmin();
  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
