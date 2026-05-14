import { useEffect, useState } from "react";
import { useSettings } from "@contexts/SettingsContext";
import type { ThemeKey } from "../../types";

/**
 * Manages theme settings, including system preference.
 * @returns Current theme, user preference, and functions to update them.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const initial: ThemeKey = (settings.display?.theme ?? "dark") as ThemeKey;
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

  // Toggle between "light" and "dark" themes, respecting system preference if set
  const toggleTheme = () => setTheme(preference === "dark" ? "light" : "dark");

  return {
    theme,
    preference,
    setPreference: setTheme,
    setTheme: setTheme as (t: ThemeKey) => void,
    toggleTheme,
  };
}
