"use client";

import Button from "@/components/Button";

export default function MobileStickyBar({
  phone,
  bookingHref,
}: {
  phone: string;
  bookingHref: string;
}) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto flex w-[92%] max-w-md gap-3 rounded-full bg-[var(--surface)] p-2 shadow-[var(--shadow)] lg:hidden border border-[var(--border)]">
      <Button href={`tel:${phone}`} variant="secondary" className="w-full">
        Call
      </Button>
      <Button href={bookingHref} className="w-full">
        Book
      </Button>
    </div>
  );
}
