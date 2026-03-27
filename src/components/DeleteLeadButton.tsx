"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteLeadButton({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this lead? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
