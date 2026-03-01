"use client";

import { useEffect } from "react";
import {
  applyThemeMode,
  getSavedThemeMode,
  THEME_MODE_EVENT,
  THEME_MODE_KEY,
} from "@/lib/theme";

export default function ThemeSync() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const syncFromStorage = () => {
      const mode = getSavedThemeMode();
      applyThemeMode(mode);
    };

    const handleSystemChange = () => {
      if (getSavedThemeMode() === "system") {
        applyThemeMode("system");
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === THEME_MODE_KEY) {
        syncFromStorage();
      }
    };

    syncFromStorage();

    mediaQuery.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(THEME_MODE_EVENT, syncFromStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(THEME_MODE_EVENT, syncFromStorage);
    };
  }, []);

  return null;
}
