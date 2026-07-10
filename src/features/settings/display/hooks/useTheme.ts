import { useEffect, useState } from "react";
import { useSettings } from "@contexts/SettingsContext";
import type { ThemeKey, AccentKey } from "../../types";

/**
 * Manages theme settings, including system preference.
 * @returns Current theme, user preference, and functions to update them.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const initial: ThemeKey = (settings.display?.theme ?? "dark") as ThemeKey;
  const initialAccent = (settings.display?.accent ?? "blue") as AccentKey;
  const [preference, setPreference] = useState<ThemeKey>(initial);
  const [theme, setThemeState] = useState<ThemeKey>(() =>
    initial === "system" && typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : (initial as ThemeKey),
  );

  // Sync preference with settings on load and when it changes
  useEffect(() => {
    setPreference((settings.display?.theme ?? "dark") as ThemeKey);
  }, [settings.display?.theme]);

  // Listen to system theme changes if preference is "system"
  useEffect(() => {
    if (preference === "system") {
      if (typeof window === "undefined" || !window.matchMedia) return;
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) =>
        setThemeState(e.matches ? "dark" : "light");
      setThemeState(mq.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    setThemeState(preference as ThemeKey);
  }, [preference]);

  // Update theme in settings when preference changes
  const setTheme = (p: ThemeKey) => {
    setPreference(p);
    updateSettings({ display: { ...(settings.display ?? {}), theme: p } });
  };

  // Accent selection
  const [accent, setAccentState] =
    useState<typeof initialAccent>(initialAccent);

  useEffect(() => {
    setAccentState((settings.display?.accent ?? "blue") as AccentKey);
  }, [settings.display?.accent]);

  const setAccent = (a: typeof initialAccent) => {
    setAccentState(a);
    updateSettings({ display: { ...(settings.display ?? {}), accent: a } });
  };

  // Apply accent to CSS variables so the UI updates immediately.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    const srcVarBase = `--color-accent-${accent}`;

    if (accent === "blue") {
      root.style.setProperty("--color-primary", "var(--color-primary-default)");
    } else {
      root.style.setProperty("--color-primary", `var(${srcVarBase})`);
    }

    // Update hover/active to follow the accent tokens
    root.style.setProperty("--color-primary-hover", `var(${srcVarBase}-hover)`);
    root.style.setProperty(
      "--color-primary-active",
      `var(${srcVarBase}-active)`,
    );
  }, [accent]);

  return {
    theme,
    preference,
    setPreference: setTheme,
    setTheme: setTheme as (t: ThemeKey) => void,
    accent,
    setAccent,
  };
}
