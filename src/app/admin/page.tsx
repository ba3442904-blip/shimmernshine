import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

function startOfWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  return new Date(now.setDate(diff));
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const db = getDb();
  const weekStart = startOfWeek();
  const [newLeads, leadCounts, recentLeads] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: weekStart } } }),
    db.lead.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { service: true },
    }),
  ]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            New leads this week
          </div>
          <div className="mt-2 text-3xl font-semibold">{newLeads}</div>
        </Card>
        {leadCounts.map((item) => (
          <Card key={item.status}>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              {item.status}
            </div>
            <div className="mt-2 text-3xl font-semibold">{item._count.status}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-sm font-semibold">Recent leads</div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--muted)]">
                <th className="pb-2">Name</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-[var(--divider)]">
                  <td className="py-2">{lead.name}</td>
                  <td className="py-2 capitalize">{lead.type}</td>
                  <td className="py-2">{lead.service?.name ?? "-"}</td>
                  <td className="py-2 capitalize">{lead.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
