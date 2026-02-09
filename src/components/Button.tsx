import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
};

const variantStyles: Record<Variant, string> = {
  primary: "btn-primary",
  secondary:
    "btn-secondary hover:border-[rgba(92,199,255,0.4)] hover:text-[var(--accent)]",
  ghost:
    "text-[var(--text)] hover:bg-[var(--surface2)] border border-transparent",
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-center no-underline hover:no-underline transition ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
