import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import GalleryUpload from "@/components/admin/GalleryUpload";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const db = getDb();
  const images = await db.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  const categories = ["interior", "exterior", "paint", "wheels"] as const;

  async function toggleImage(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const isActive = String(formData.get("isActive")) === "true";
    await db.galleryImage.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/gallery");
  }

  async function removeImage(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const deleted = await db.galleryImage.delete({ where: { id } });
    await db.galleryImage.updateMany({
      where: { sortOrder: { gt: deleted.sortOrder } },
      data: { sortOrder: { decrement: 1 } },
    });
    revalidatePath("/admin/gallery");
  }

  async function moveImage(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const direction = String(formData.get("direction"));
    const items = await db.galleryImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const index = items.findIndex((image) => image.id === id);
    if (index === -1) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    const newOrder = items.map((item) => item.id);
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(swapIndex, 0, moved);
    await db.$transaction(
      newOrder.map((itemId, idx) =>
        db.galleryImage.update({
          where: { id: itemId },
          data: { sortOrder: idx + 1 },
        })
      )
    );
    revalidatePath("/admin/gallery");
  }

  async function updateCategory(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const category = String(formData.get("category"));
    await db.galleryImage.update({
      where: { id },
      data: { category: category as never },
    });
    revalidatePath("/admin/gallery");
  }

  async function updateAlt(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const alt = String(formData.get("alt") || "");
    await db.galleryImage.update({
      where: { id },
      data: { alt },
    });
    revalidatePath("/admin/gallery");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Upload new image</div>
        <div className="mt-4">
          <GalleryUpload />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {images.map((image) => (
          <Card key={image.id} className="grid gap-3">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--surface2)]">
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <form action={updateAlt} className="flex flex-wrap items-center gap-2 text-xs">
              <input type="hidden" name="id" value={image.id} />
              <input
                name="alt"
                defaultValue={image.alt}
                className="input-surface flex-1 rounded-xl px-3 py-2 text-xs"
                placeholder="Image title"
              />
              <button className="rounded-full border border-[var(--border)] px-3 py-2 text-xs">
                Save title
              </button>
            </form>
            <form action={updateCategory} className="flex flex-wrap items-center gap-2 text-xs">
              <input type="hidden" name="id" value={image.id} />
              <select
                name="category"
                defaultValue={image.category}
                className="input-surface rounded-xl px-3 py-2 text-xs capitalize"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button className="rounded-full border border-[var(--border)] px-3 py-2 text-xs">
                Save type
              </button>
              <span className="text-[var(--muted)]">Order: {image.sortOrder}</span>
            </form>
            <div className="flex flex-wrap gap-2 text-xs">
              <form action={toggleImage}>
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="isActive" value={(!image.isActive).toString()} />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  {image.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={moveImage}>
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="direction" value="up" />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  Move up
                </button>
              </form>
              <form action={moveImage}>
                <input type="hidden" name="id" value={image.id} />
                <input type="hidden" name="direction" value="down" />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  Move down
                </button>
              </form>
              <form action={removeImage}>
                <input type="hidden" name="id" value={image.id} />
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
