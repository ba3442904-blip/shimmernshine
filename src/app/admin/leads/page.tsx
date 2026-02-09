import { revalidatePath } from "next/cache";
import { LeadStatus, LeadType, Prisma } from "@prisma/client";
import { getDb } from "@/lib/prisma";
import Card from "@/components/Card";
import { requireAdmin } from "@/lib/requireAdmin";

type SearchParams = {
  status?: string;
  type?: string;
};

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "scheduled",
  "completed",
  "archived",
] as const;

const TYPE_OPTIONS = ["quote", "booking"] as const;

function toLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isLeadStatus(value: string): value is LeadStatus {
  return STATUS_OPTIONS.includes(value as LeadStatus);
}

function isLeadType(value: string): value is LeadType {
  return TYPE_OPTIONS.includes(value as LeadType);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const db = getDb();
  const status = searchParams?.status ?? "all";
  const type = searchParams?.type ?? "all";

  const where: Prisma.LeadWhereInput = {};
  if (status !== "all" && isLeadStatus(status)) {
    where.status = status;
  }
  if (type !== "all" && isLeadType(type)) {
    where.type = type;
  }

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { service: true },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const leadId = String(formData.get("leadId"));
    const statusValue = String(formData.get("status"));
    await db.lead.update({
      where: { id: leadId },
      data: { status: statusValue as LeadStatus },
    });
    revalidatePath("/admin/leads");
  }

  async function updateNotes(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const leadId = String(formData.get("leadId"));
    const internalNotes = String(formData.get("internalNotes") || "");
    await db.lead.update({
      where: { id: leadId },
      data: { internalNotes },
    });
    revalidatePath("/admin/leads");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-semibold">Leads</div>
          <a
            href="/api/admin/leads/export"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold"
          >
            Export CSV
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
          <a href="/admin/leads?status=all" className="rounded-full bg-[var(--surface2)] px-3 py-2">
            All Statuses
          </a>
          {STATUS_OPTIONS.map((s) => (
            <a
              key={s}
              href={`/admin/leads?status=${s}`}
              className="rounded-full bg-[var(--surface2)] px-3 py-2"
            >
              {toLabel(s)}
            </a>
          ))}
          <a href="/admin/leads?type=quote" className="rounded-full bg-[var(--surface2)] px-3 py-2">
            Quotes
          </a>
          <a
            href="/admin/leads?type=booking"
            className="rounded-full bg-[var(--surface2)] px-3 py-2"
          >
            Bookings
          </a>
        </div>
      </Card>

      <div className="grid gap-4">
        {leads.map((lead) => (
          <Card key={lead.id} className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{lead.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {lead.phone} - {lead.email || "No email"}
                </div>
              </div>
              <div className="text-xs font-semibold text-[var(--muted)]">
                {toLabel(lead.type)} - {toLabel(lead.status)}
              </div>
            </div>
            <div className="grid gap-2 text-xs text-[var(--muted)]">
              <div>Service: {lead.service?.name ?? "Not selected"}</div>
              <div>Vehicle: {lead.vehicleType || "-"}</div>
              <div>Preferred date: {lead.preferredDate || "-"}</div>
            </div>
            {lead.notes ? (
              <div className="rounded-xl bg-[var(--surface2)] p-3 text-xs text-[var(--muted)]">
                Client notes: {lead.notes}
              </div>
            ) : null}
            <form action={updateNotes} className="grid gap-2">
              <input type="hidden" name="leadId" value={lead.id} />
              <label className="text-xs font-semibold text-[var(--muted)]">
                Internal notes
              </label>
              <textarea
                name="internalNotes"
                defaultValue={lead.internalNotes || ""}
                rows={2}
                className="input-surface rounded-xl px-3 py-2 text-xs"
              />
              <button className="self-start rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">
                Save notes
              </button>
            </form>
            <form action={updateStatus} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <select
                name="status"
                defaultValue={lead.status}
                className="input-surface rounded-xl px-3 py-2 text-xs"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {toLabel(s)}
                  </option>
                ))}
              </select>
              <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
                Update status
              </button>
              <a
                href={`tel:${lead.phone}`}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold"
              >
                Call
              </a>
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold"
                >
                  Email
                </a>
              ) : null}
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
