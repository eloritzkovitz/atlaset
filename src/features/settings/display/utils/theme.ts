/**
 * Utilities for managing and applying themes in the application.
 */

import { getCachedValue } from "@utils";
import type { AccentKey, DisplaySettings, ThemeKey } from "../types";

export const THEME_CACHE_KEY = "atlaset:theme_key";
export const ACCENT_CACHE_KEY = "atlaset:accent_key";

/**
 * Resolves 'system' theme down to an actual 'dark' or 'light' string.
 * @param preference - The theme preference, which can be 'dark', 'light', or 'system'.
 * @returns The resolved theme as 'dark' or 'light'.
 */
export function resolveTheme(preference?: ThemeKey): "dark" | "light" {
  if (
    preference === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia
  ) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return (preference as "dark" | "light") ?? "dark";
}

/**
 * Applies the theme to the document based on display settings.
 * @param display - The display settings containing theme and preference.
 * @returns A cleanup function to remove listeners if system preference is used.
 */
export function applyTheme(display?: Partial<DisplaySettings>) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const resolvedTheme = resolveTheme(display?.theme);
  root.classList.toggle("dark", resolvedTheme === "dark");

  const accent = (display?.accent ?? "blue") as AccentKey;
  const srcVarBase = `--color-accent-${accent}`;

  if (accent === "blue") {
    root.style.setProperty("--color-primary", "var(--color-primary-default)");
  } else {
    root.style.setProperty("--color-primary", `var(${srcVarBase})`);
  }

  root.style.setProperty("--color-primary-hover", `var(${srcVarBase}-hover)`);
  root.style.setProperty("--color-primary-active", `var(${srcVarBase}-active)`);
}

/** Synchronously applies cached theme before React mounts */
export function initCachedTheme() {
  const theme = getCachedValue<ThemeKey>(THEME_CACHE_KEY, "dark");
  const accent = getCachedValue<AccentKey>(ACCENT_CACHE_KEY, "blue");
  applyTheme({ theme, accent });
}

initCachedTheme();
