"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Services", href: "/admin/services" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Add-ons", href: "/admin/addons" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "FAQs", href: "/admin/faq" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface2)] px-4 py-2 text-sm font-semibold text-[var(--text)] lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="text-sm font-semibold sm:text-base">Owner Dashboard</div>
        </div>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          Logout
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
          <div className="absolute left-0 right-0 top-0 rounded-b-3xl bg-[var(--surface)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Admin Menu</div>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-sm font-semibold text-[var(--text)]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
