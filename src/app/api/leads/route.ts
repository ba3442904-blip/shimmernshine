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

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await db.lead.findFirst({
      where: { phone: data.phone, createdAt: { gte: since } },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "It looks like we already have your information — we'll be in touch soon!",
        },
        { status: 409 }
      );
    }

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
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
