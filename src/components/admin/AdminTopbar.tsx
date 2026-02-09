"use client";

import { signOut } from "next-auth/react";

export default function AdminTopbar() {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="text-sm font-semibold">Owner Dashboard</div>
      <button
        type="button"
        className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)]"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        Logout
      </button>
    </div>
  );
}
