import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const db = getDb();

  try {
    await db.lead.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json({ error: "Failed to delete lead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
