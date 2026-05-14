/**
 * Utilities for theme management based on display settings, including applying themes and handling system preferences.
 */

import type { DisplaySettings } from "@features/settings/types";

/**
 * Applies the theme to the document based on display settings.
 * @param display - The display settings containing theme and preference.
 * @returns A cleanup function to remove listeners if system preference is used.
 */
export function applyTheme(display?: DisplaySettings) {
  const doc = typeof document !== "undefined" ? document.documentElement : null;
  if (!doc) return undefined;

  const pref = display?.theme;
  const resolve = () => {
    if (
      pref === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia
    ) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return (display?.theme as string) ?? "dark";
  };

  const apply = (t: string) => doc.classList.toggle("dark", t === "dark");
  apply(resolve());

  // Listen to system preference changes if 'system' is selected
  if (pref === "system" && typeof window !== "undefined" && window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      apply(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }

  return undefined;
}
