import Link from "next/link";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Services", href: "/admin/services" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Add-ons", href: "/admin/addons" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "FAQ", href: "/admin/faq" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-6 lg:flex">
      <div className="text-lg font-semibold">Shimmer N Shine</div>
      <nav className="mt-8 grid gap-2 text-sm font-semibold text-[var(--muted)]">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-3 py-2 text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
