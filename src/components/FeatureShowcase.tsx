"use client";

import { useState } from "react";

export default function FeatureShowcase({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="card-surface card-hover p-6">
      <div className="rounded-2xl bg-[var(--surface2)] p-8 text-sm font-semibold text-[var(--muted)]">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
          {title}
        </div>
        <div className="min-h-[160px] rounded-2xl bg-[var(--surface)] p-6 text-[var(--text)] shadow-sm">
          {images[active]}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {images.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`rounded-xl border px-3 py-4 text-left text-xs font-semibold transition ${
              active === index
                ? "border-[var(--accent)] bg-[rgba(92,199,255,0.12)] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
            }`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
