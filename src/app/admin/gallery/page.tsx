import Card from "@/components/Card";
import { requireAdmin } from "@/lib/requireAdmin";

export default async function AdminGalleryPage() {
  await requireAdmin();

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-sm font-semibold">Gallery management moved</div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Public gallery content is now powered by Instagram embeds from
          <span className="font-semibold text-[var(--text)]"> Admin Settings</span>.
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Update the Instagram embed URL in <span className="font-semibold">Settings</span> to
          control what appears on the gallery page.
        </p>
      </Card>
    </div>
  );
}
