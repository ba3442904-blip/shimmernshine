import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminReviewsPage() {
  await requireAdmin();
  const db = getDb();
  const reviews = await db.review.findMany({
    orderBy: { sortOrder: "asc" },
  });

  async function createReview(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const name = String(formData.get("name") || "");
    const text = String(formData.get("text") || "");
    const stars = Number(formData.get("stars") || 5);
    const date = String(formData.get("date") || "");
    await db.review.create({
      data: {
        name,
        text,
        stars,
        date,
        isFeatured: formData.get("isFeatured") === "on",
        sortOrder: reviews.length + 1,
      },
    });
    revalidatePath("/admin/reviews");
  }

  async function toggleReview(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const field = String(formData.get("field"));
    const value = formData.get("value") === "true";
    await db.review.update({ where: { id }, data: { [field]: value } });
    revalidatePath("/admin/reviews");
  }

  async function updateReview(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const name = String(formData.get("name") || "");
    const text = String(formData.get("text") || "");
    const stars = Number(formData.get("stars") || 5);
    const date = String(formData.get("date") || "");
    await db.review.update({
      where: { id },
      data: { name, text, stars, date },
    });
    revalidatePath("/admin/reviews");
  }

  async function removeReview(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    await db.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Add review</div>
        <form action={createReview} className="mt-4 grid gap-3">
          <input
            name="name"
            placeholder="Customer name"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <textarea
            name="text"
            placeholder="Review text"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            rows={3}
            required
          />
          <input
            name="date"
            placeholder="Jan 2026"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <input
            name="stars"
            type="number"
            min="1"
            max="5"
            defaultValue={5}
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <input type="checkbox" name="isFeatured" defaultChecked />
            Feature this review
          </label>
          <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
            Add review
          </button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id} className="grid gap-3">
            <div className="text-sm font-semibold">{review.name}</div>
            <div className="text-xs text-[var(--muted)]">{"★".repeat(review.stars)}</div>
            <p className="text-sm text-[var(--muted)]">{review.text}</p>
            <form action={updateReview} className="grid gap-2">
              <input type="hidden" name="id" value={review.id} />
              <input
                name="name"
                defaultValue={review.name}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <textarea
                name="text"
                defaultValue={review.text}
                className="input-surface rounded-xl px-3 py-2 text-sm"
                rows={3}
              />
              <input
                name="date"
                defaultValue={review.date}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <input
                name="stars"
                type="number"
                min="1"
                max="5"
                defaultValue={review.stars}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <button className="self-start rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">
                Save changes
              </button>
            </form>
            <div className="flex flex-wrap gap-2 text-xs">
              <form action={toggleReview}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="field" value="isFeatured" />
                <input type="hidden" name="value" value={(!review.isFeatured).toString()} />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  {review.isFeatured ? "Unfeature" : "Feature"}
                </button>
              </form>
              <form action={toggleReview}>
                <input type="hidden" name="id" value={review.id} />
                <input type="hidden" name="field" value="isActive" />
                <input type="hidden" name="value" value={(!review.isActive).toString()} />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  {review.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={removeReview}>
                <input type="hidden" name="id" value={review.id} />
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
