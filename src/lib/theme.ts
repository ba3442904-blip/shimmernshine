export type Theme = "dark" | "light";
export type ThemeMode = "system" | "light" | "dark";

export const THEME_MODE_KEY = "theme-mode";
export const THEME_MODE_EVENT = "theme-mode-change";

export function getDeviceTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(mode: ThemeMode): Theme {
  if (mode === "system") {
    return getDeviceTheme();
  }

  return mode;
}

export function getSavedThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const saved = window.localStorage.getItem(THEME_MODE_KEY);
  if (saved === "system" || saved === "light" || saved === "dark") {
    return saved;
  }

  return "system";
}

export function applyThemeMode(mode: ThemeMode) {
  if (typeof window === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", resolveTheme(mode));
}
