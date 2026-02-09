import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`card-surface card-hover p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
