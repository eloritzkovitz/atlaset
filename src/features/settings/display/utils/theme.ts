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

  // Apply accent tokens synchronously so accents are available before paint.
  const accent = (display?.accent ?? "blue") as string;
  try {
    const srcVarBase = `--color-accent-${accent}`;
    if (accent === "blue") {
      doc.style.setProperty("--color-primary", "var(--color-primary-default)");
    } else {
      doc.style.setProperty("--color-primary", `var(${srcVarBase})`);
    }
    doc.style.setProperty("--color-primary-hover", `var(${srcVarBase}-hover)`);
    doc.style.setProperty(
      "--color-primary-active",
      `var(${srcVarBase}-active)`,
    );
  } catch {
    // ignore if CSS variables cannot be set in this environment
  }

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
