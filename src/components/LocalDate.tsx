"use client";

export default function LocalDate({
  date,
  options,
}: {
  date: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = new Date(date);
  const defaults: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return <>{d.toLocaleString("en-US", options ?? defaults)}</>;
}
