import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const db = getDb();
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true },
  });

  const headers = [
    "id",
    "type",
    "name",
    "phone",
    "email",
    "vehicleType",
    "service",
    "preferredDate",
    "address",
    "notes",
    "internalNotes",
    "status",
    "createdAt",
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.type,
    lead.name,
    lead.phone,
    lead.email ?? "",
    lead.vehicleType ?? "",
    lead.service?.name ?? "",
    lead.preferredDate ?? "",
    lead.address ?? "",
    lead.notes ?? "",
    lead.internalNotes ?? "",
    lead.status,
    lead.createdAt.toISOString(),
  ]);

  const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => String(cell).replace(/\\n/g, " ").replace(/,/g, ";")).join(","))].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=leads.csv",
    },
  });
}
