"use client";

import { useEffect, useState } from "react";
import {
  applyThemeMode,
  getSavedThemeMode,
  ThemeMode,
  THEME_MODE_EVENT,
  THEME_MODE_KEY,
} from "@/lib/theme";

const MODES: { mode: ThemeMode; label: string }[] = [
  { mode: "system", label: "Device" },
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
];

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(getSavedThemeMode);

  useEffect(() => {
    applyThemeMode(mode);
  }, [mode]);

  function setThemeMode(nextMode: ThemeMode) {
    setMode(nextMode);
    window.localStorage.setItem(THEME_MODE_KEY, nextMode);
    applyThemeMode(nextMode);
    window.dispatchEvent(new Event(THEME_MODE_EVENT));
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 ${className}`}
      role="group"
      aria-label="Theme mode"
    >
      {MODES.map((option) => {
        const selected = mode === option.mode;
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => setThemeMode(option.mode)}
            aria-pressed={selected}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              selected
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
