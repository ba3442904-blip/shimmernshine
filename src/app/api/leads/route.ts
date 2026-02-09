import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { leadSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const db = getDb();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const limiter = rateLimit(`lead:${ip}`, 5, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const data = parsed.data;

  await db.lead.create({
    data: {
      type: data.type,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      vehicleType: data.vehicleType || null,
      serviceId: data.serviceId || null,
      preferredDate: data.preferredDate || null,
      address: data.address || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json({ ok: true });
}
