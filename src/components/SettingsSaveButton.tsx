"use client";

import { useFormStatus } from "react-dom";

export default function SettingsSaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-full bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Saving\u2026" : "Save settings"}
    </button>
  );
}
