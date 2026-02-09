import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminAddOnsPage() {
  await requireAdmin();
  const db = getDb();
  const addOns = await db.addOn.findMany({ orderBy: { sortOrder: "asc" } });

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
    revalidatePath("/admin/addons");
  }

  async function toggleAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const isActive = String(formData.get("isActive")) === "true";
    await db.addOn.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/addons");
  }

  async function updateAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const name = String(formData.get("name") || "");
    const description = String(formData.get("description") || "");
    const priceCents = Number(formData.get("priceCents") || 0) * 100;
    await db.addOn.update({
      where: { id },
      data: { name, description, priceCents },
    });
    revalidatePath("/admin/addons");
  }

  async function removeAddOn(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    await db.addOn.delete({ where: { id } });
    revalidatePath("/admin/addons");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Add add-on</div>
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
      </Card>

      <div className="grid gap-3">
        {addOns.map((addOn) => (
          <Card key={addOn.id} className="grid gap-4">
            <form action={updateAddOn} className="grid gap-3 lg:grid-cols-[1fr_1.4fr_140px_auto] items-center">
              <input type="hidden" name="id" value={addOn.id} />
              <input
                name="name"
                defaultValue={addOn.name}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <input
                name="description"
                defaultValue={addOn.description}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <input
                name="priceCents"
                type="number"
                defaultValue={(addOn.priceCents / 100).toFixed(0)}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
                Save
              </button>
            </form>
            <div className="flex flex-wrap gap-2 text-xs">
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
          </Card>
        ))}
      </div>
    </div>
  );
}
