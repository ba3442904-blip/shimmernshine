"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getDeviceTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(getDeviceTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncTheme = () => {
      setTheme(getDeviceTheme());
    };

    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncTheme);
    };
  }, []);

  return (
    <span
      className={`inline-flex rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted)] ${className}`}
      aria-live="polite"
    >
      Device: {theme === "dark" ? "Dark mode" : "Light mode"}
    </span>
  );
}
