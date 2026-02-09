"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/Icons";

export default function FAQAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const contentId = `faq-${index}`;
        return (
          <div
            key={item.question}
            className="card-surface card-hover p-5"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              {item.question}
              <span
                className={`transition ${isOpen ? "rotate-180 text-[var(--primary)]" : "text-[var(--muted)]"}`}
              >
                <ChevronIcon />
              </span>
            </button>
            <div
              id={contentId}
              className={`overflow-hidden text-sm text-[var(--muted)] transition-all ${isOpen ? "mt-3 max-h-40" : "max-h-0"}`}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
