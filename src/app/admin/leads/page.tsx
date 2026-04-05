import { revalidatePath } from "next/cache";
import { LeadStatus, LeadType, Prisma } from "@prisma/client";
import { getDb } from "@/lib/prisma";
import Card from "@/components/Card";
import DeleteLeadButton from "@/components/DeleteLeadButton";
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

const FILTER_STATUSES = ["new", "contacted", "scheduled"] as const;

const TYPE_OPTIONS = ["quote", "booking"] as const;

function toLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function filterUrl(current: { status: string; type: string }, overrides: Partial<{ status: string; type: string }>) {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (merged.status !== "all") params.set("status", merged.status);
  if (merged.type !== "all") params.set("type", merged.type);
  const qs = params.toString();
  return `/admin/leads${qs ? `?${qs}` : ""}`;
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
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const db = getDb();
  const { status: statusParam, type: typeParam } = await searchParams ?? {};
  const status = statusParam ?? "all";
  const type = typeParam ?? "all";

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
    const statusValue = String(formData.get("status")) as LeadStatus;

    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: { service: true, calendarEvent: true },
    });

    await db.lead.update({
      where: { id: leadId },
      data: { status: statusValue },
    });

    // Calendar sync
    if (lead) {
      try {
        const { getAuthedClient, createCalendarEvent, deleteCalendarEvent } =
          await import("@/lib/googleCalendar");

        // Find the connected calendar token
        const token = await db.googleCalendarToken.findFirst();
        if (token) {
          const authed = await getAuthedClient(token.userId);
          if (authed) {
            if (statusValue === "scheduled" && !lead.calendarEvent) {
              // Create calendar event
              const event = await createCalendarEvent(authed, lead);
              if (event.id) {
                await db.calendarEvent.create({
                  data: {
                    leadId,
                    googleEventId: event.id,
                    calendarId: token.calendarId,
                  },
                });
              }
            } else if (
              lead.calendarEvent &&
              (statusValue === "completed" || statusValue === "archived")
            ) {
              // Delete calendar event
              try {
                await deleteCalendarEvent(authed, lead.calendarEvent.googleEventId);
              } catch {
                // Event may already be deleted
              }
              await db.calendarEvent.delete({
                where: { id: lead.calendarEvent.id },
              });
            }
          }
        }
      } catch {
        // Calendar sync failure shouldn't block status update
      }
    }

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
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/admin/leads/export"
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold"
          >
            Export CSV
          </a>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <a
              href={filterUrl({ status, type }, { status: "all" })}
              className={`rounded-full px-3 py-2 ${status === "all" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface2)]"}`}
            >
              All
            </a>
            {FILTER_STATUSES.map((s) => (
              <a
                key={s}
                href={filterUrl({ status, type }, { status: s })}
                className={`rounded-full px-3 py-2 ${status === s ? "bg-[var(--primary)] text-white" : "bg-[var(--surface2)]"}`}
              >
                {toLabel(s)}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <a
              href={filterUrl({ status, type }, { type: "all" })}
              className={`rounded-full px-3 py-2 ${type === "all" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface2)]"}`}
            >
              All Types
            </a>
            {TYPE_OPTIONS.map((t) => (
              <a
                key={t}
                href={filterUrl({ status, type }, { type: t })}
                className={`rounded-full px-3 py-2 ${type === t ? "bg-[var(--primary)] text-white" : "bg-[var(--surface2)]"}`}
              >
                {toLabel(t)}
              </a>
            ))}
          </div>
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
              <div className="grid gap-0.5 text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">
                  {toLabel(lead.type)} - {toLabel(lead.status)}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {lead.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  {lead.createdAt.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
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
              <DeleteLeadButton leadId={lead.id} />
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
