import { revalidatePath } from "next/cache";
import Card from "@/components/Card";
import { getDb } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminFaqPage() {
  await requireAdmin();
  const db = getDb();
  const faqs = await db.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  async function createFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const question = String(formData.get("question") || "");
    const answer = String(formData.get("answer") || "");
    await db.fAQ.create({
      data: { question, answer, sortOrder: faqs.length + 1 },
    });
    revalidatePath("/admin/faq");
  }

  async function toggleFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const isActive = String(formData.get("isActive")) === "true";
    await db.fAQ.update({ where: { id }, data: { isActive } });
    revalidatePath("/admin/faq");
  }

  async function updateFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    const question = String(formData.get("question") || "");
    const answer = String(formData.get("answer") || "");
    await db.fAQ.update({ where: { id }, data: { question, answer } });
    revalidatePath("/admin/faq");
  }

  async function removeFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const db = getDb();
    const id = String(formData.get("id"));
    await db.fAQ.delete({ where: { id } });
    revalidatePath("/admin/faq");
  }

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Add FAQs</div>
        <form action={createFaq} className="mt-4 grid gap-3">
          <input
            name="question"
            placeholder="Question"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            required
          />
          <textarea
            name="answer"
            placeholder="Answer"
            className="input-surface rounded-xl px-3 py-2 text-sm"
            rows={3}
            required
          />
          <button className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white">
            Add FAQs
          </button>
        </form>
      </Card>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.id} className="grid gap-3">
            <div className="text-sm font-semibold">{faq.question}</div>
            <p className="text-sm text-[var(--muted)]">{faq.answer}</p>
            <form action={updateFaq} className="grid gap-2">
              <input type="hidden" name="id" value={faq.id} />
              <input
                name="question"
                defaultValue={faq.question}
                className="input-surface rounded-xl px-3 py-2 text-sm"
              />
              <textarea
                name="answer"
                defaultValue={faq.answer}
                className="input-surface rounded-xl px-3 py-2 text-sm"
                rows={3}
              />
              <button className="faq-save-cta self-start rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold">
                Save changes
              </button>
            </form>
            <div className="flex flex-wrap gap-2 text-xs">
              <form action={toggleFaq}>
                <input type="hidden" name="id" value={faq.id} />
                <input type="hidden" name="isActive" value={(!faq.isActive).toString()} />
                <button className="rounded-full border border-[var(--border)] px-3 py-2">
                  {faq.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
              <form action={removeFaq}>
                <input type="hidden" name="id" value={faq.id} />
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
