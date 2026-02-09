import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default async function AdminServicesPage() {
  await requireAdmin();
  const db = getDb();
  const services = await db.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  async function createService(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const name = String(formData.get("name") || "");
    const shortDescription = String(formData.get("shortDescription") || "");
    const longDescription = String(formData.get("longDescription") || "");
    const durationMins = Number(formData.get("durationMins") || 0);
    const slug = slugify(name);

    const newService = await db.service.create({
      data: {
        name,
        slug,
        shortDescription,
        longDescription,
        durationMins,
        sortOrder: services.length + 1,
      },
    });

    await db.priceTier.createMany({
      data: [
        { serviceId: newService.id, vehicleSize: "sedan", priceCents: 0, isStartingAt: true },
        { serviceId: newService.id, vehicleSize: "suv", priceCents: 0, isStartingAt: true },
        { serviceId: newService.id, vehicleSize: "truck", priceCents: 0, isStartingAt: true },
      ],
    });
    revalidatePath("/admin/services");
  }

  async function toggleService(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const isActive = String(formData.get("isActive")) === "true";
    await db.service.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/services");
  }

  async function updateService(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const name = String(formData.get("name") || "");
    const shortDescription = String(formData.get("shortDescription") || "");
    const longDescription = String(formData.get("longDescription") || "");
    const durationMins = Number(formData.get("durationMins") || 0);
    await db.service.update({
      where: { id },
      data: { name, shortDescription, longDescription, durationMins },
    });
    revalidatePath("/admin/services");
  }

  async function removeService(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    await db.priceTier.deleteMany({ where: { serviceId: id } });
    await db.service.delete({ where: { id } });
    revalidatePath("/admin/services");
  }

  async function moveService(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const direction = String(formData.get("direction"));
    const items = await db.service.findMany({ orderBy: { sortOrder: "asc" } });
    const index = items.findIndex((service) => service.id === id);
    if (index === -1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const current = items[index];
    const swap = items[swapIndex];

    await db.$transaction([
      db.service.update({
        where: { id: current.id },
        data: { sortOrder: swap.sortOrder },
      }),
      db.service.update({
        where: { id: swap.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
    revalidatePath("/admin/services");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Add service</div>
        <form action={createService} className="mt-4 grid gap-3">
          <input
            name="name"
            placeholder="Service name"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <input
            name="shortDescription"
            placeholder="Short description"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <textarea
            name="longDescription"
            placeholder="Long description"
            rows={3}
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <input
            name="durationMins"
            type="number"
            placeholder="Duration (mins)"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
            Create service
          </button>
        </form>
      </Card>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{service.name}</div>
                <div className="text-xs text-[var(--muted)]">{service.shortDescription}</div>
              </div>
              <div className="text-xs text-[var(--muted)]">
                {service.durationMins} mins
              </div>
            </div>
            <form action={updateService} className="grid gap-2">
              <input type="hidden" name="id" value={service.id} />
              <input
                name="name"
                defaultValue={service.name}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <input
                name="shortDescription"
                defaultValue={service.shortDescription}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <textarea
                name="longDescription"
                defaultValue={service.longDescription}
                rows={3}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <input
                name="durationMins"
                type="number"
                defaultValue={service.durationMins}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <button className="self-start rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">
                Save changes
              </button>
            </form>
            <div className="flex flex-wrap gap-2 text-xs">
              <form action={toggleService}>
                <input type="hidden" name="id" value={service.id} />
                <input type="hidden" name="isActive" value={(!service.isActive).toString()} />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  {service.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={moveService}>
                <input type="hidden" name="id" value={service.id} />
                <input type="hidden" name="direction" value="up" />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  Move up
                </button>
              </form>
              <form action={moveService}>
                <input type="hidden" name="id" value={service.id} />
                <input type="hidden" name="direction" value="down" />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  Move down
                </button>
              </form>
              <form action={removeService}>
                <input type="hidden" name="id" value={service.id} />
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
