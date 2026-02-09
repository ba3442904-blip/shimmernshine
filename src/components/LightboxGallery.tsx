"use client";

import { useMemo, useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  category: "interior" | "exterior" | "paint" | "wheels";
};

const filters = [
  { label: "All", value: "all" },
  { label: "Interior", value: "interior" },
  { label: "Exterior", value: "exterior" },
  { label: "Paint", value: "paint" },
  { label: "Wheels", value: "wheels" },
];

export default function LightboxGallery({ images }: { images: GalleryImage[] }) {
  const [filter, setFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return images;
    return images.filter((img) => img.category === filter);
  }, [filter, images]);

  const activeImage = activeIndex !== null ? filtered[activeIndex] : null;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((chip) => (
          <button
            key={chip.value}
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === chip.value
                ? "bg-[var(--accent2)] text-white"
                : "bg-[var(--surface2)] text-[var(--muted)]"
            }`}
            onClick={() => setFilter(chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className="mb-4 w-full rounded-3xl bg-[var(--surface2)] p-3 text-left shadow-[var(--shadow-soft)]"
            onClick={() => setActiveIndex(index)}
          >
            <div className="aspect-[4/3] rounded-2xl bg-[var(--surface)] text-xs font-semibold text-[var(--muted)] shadow-sm flex items-center justify-center">
              {image.alt}
            </div>
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-3xl rounded-3xl bg-[var(--surface)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{activeImage.alt}</div>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-3 py-2 text-xs"
                onClick={() => setActiveIndex(null)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 aspect-[16/9] rounded-2xl bg-[var(--surface2)] text-xs font-semibold text-[var(--muted)] flex items-center justify-center">
              {activeImage.alt}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                className="text-sm font-semibold text-[var(--primary)]"
                onClick={() =>
                  setActiveIndex((prev) => (prev && prev > 0 ? prev - 1 : prev))
                }
              >
                Previous
              </button>
              <button
                type="button"
                className="text-sm font-semibold text-[var(--primary)]"
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev !== null && prev < filtered.length - 1 ? prev + 1 : prev
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
