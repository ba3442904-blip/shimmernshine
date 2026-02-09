import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(0);
}

export default async function AdminPricingPage() {
  await requireAdmin();
  const db = getDb();
  const [services, addOns] = await Promise.all([
    db.service.findMany({
      orderBy: { sortOrder: "asc" },
      include: { priceTiers: true },
    }),
    db.addOn.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  async function updateTier(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const priceCents = Number(formData.get("priceCents")) * 100;
    const isStartingAt = formData.get("isStartingAt") === "on";
    await db.priceTier.update({
      where: { id },
      data: { priceCents, isStartingAt },
    });
    revalidatePath("/admin/pricing");
  }

  async function createAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const name = String(formData.get("name") || "");
    const description = String(formData.get("description") || "");
    const priceCents = Number(formData.get("priceCents") || 0) * 100;
    await db.addOn.create({
      data: { name, description, priceCents, sortOrder: addOns.length + 1 },
    });
    revalidatePath("/admin/pricing");
  }

  async function toggleAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const isActive = String(formData.get("isActive")) === "true";
    await db.addOn.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/pricing");
  }

  async function removeAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    await db.addOn.delete({ where: { id } });
    revalidatePath("/admin/pricing");
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="text-sm font-semibold">{service.name} pricing</div>
            <div className="mt-4 grid gap-3 max-w-xl">
              {service.priceTiers.map((tier) => (
                <form
                  key={tier.id}
                  action={updateTier}
                  className="grid gap-2 sm:grid-cols-[120px_120px_auto_auto] items-center"
                >
                  <input type="hidden" name="id" value={tier.id} />
                  <div className="text-xs font-semibold capitalize text-[var(--muted)]">
                    {tier.vehicleSize}
                  </div>
                  <input
                    name="priceCents"
                    defaultValue={formatPrice(tier.priceCents)}
                    className="input-surface w-28 rounded-xl px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <input type="checkbox" name="isStartingAt" defaultChecked={tier.isStartingAt} />
                    Starting at
                  </label>
                  <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
                    Save
                  </button>
                </form>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-sm font-semibold">Add-ons</div>
        <form action={createAddOn} className="mt-4 grid gap-3">
          <input
            name="name"
            placeholder="Add-on name"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <input
            name="description"
            placeholder="Description"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <input
            name="priceCents"
            type="number"
            placeholder="Price"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
            Add add-on
          </button>
        </form>

        <div className="mt-6 grid gap-3">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] p-3 text-sm">
              <div>
                <div className="font-semibold">{addOn.name}</div>
                <div className="text-xs text-[var(--muted)]">{addOn.description}</div>
              </div>
              <div className="flex gap-2 text-xs">
                <form action={toggleAddOn}>
                  <input type="hidden" name="id" value={addOn.id} />
                  <input type="hidden" name="isActive" value={(!addOn.isActive).toString()} />
                  <button className="rounded-full border border-[var(--border)] px-3 py-2">
                    {addOn.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={removeAddOn}>
                  <input type="hidden" name="id" value={addOn.id} />
                  <button className="rounded-full border border-red-200 px-3 py-2 text-red-600">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
