import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "primary" | "neutral" | "success" | "warning";
};

const toneStyles: Record<NonNullable<BadgeProps["tone"]>, string> = {
  primary: "bg-[rgba(92,199,255,0.12)] text-[var(--accent)]",
  neutral: "bg-[var(--surface2)] text-[var(--muted)]",
  success: "bg-[rgba(11,116,255,0.12)] text-[var(--accent)]",
  warning: "bg-[rgba(11,18,32,0.08)] text-[var(--text)]",
};

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}
