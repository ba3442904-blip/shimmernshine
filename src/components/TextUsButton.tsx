"use client";

export default function TextUsButton({ smsPhone }: { smsPhone?: string }) {
  if (!smsPhone) return null;
  return (
    <a
      href={`sms:${smsPhone}`}
      className="fixed bottom-24 right-6 z-40 hidden items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-3 text-xs font-semibold text-white shadow-[var(--shadow)] hover:text-white hover:no-underline md:flex"
    >
      Text Us
    </a>
  );
}
