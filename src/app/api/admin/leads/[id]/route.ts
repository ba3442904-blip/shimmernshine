import { NextResponse } from "next/server";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();
  const db = getDb();
  const { id } = await params;

  try {
    await db.lead.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Failed to delete lead." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
