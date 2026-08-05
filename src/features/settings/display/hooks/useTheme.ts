import { useLayoutEffect, useState, useMemo } from "react";
import { useEventListener } from "@hooks";
import { getCachedValue, setCachedValue } from "@utils";
import type { ThemeKey, AccentKey } from "../types";
import { applyTheme, THEME_CACHE_KEY, ACCENT_CACHE_KEY } from "../utils/theme";
import { useSettings } from "../../common/hooks/useSettings";

/**
 *  Manages theme-related state and logic.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const preference = (settings.display?.theme ??
    getCachedValue<ThemeKey>(THEME_CACHE_KEY, "dark")) as ThemeKey;
  const accent = (settings.display?.accent ??
    getCachedValue<AccentKey>(ACCENT_CACHE_KEY, "blue")) as AccentKey;

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const resolvedTheme = preference === "system" ? systemTheme : preference;

  const mediaQuery = useMemo(() => {
    if (preference !== "system" || typeof window === "undefined") return null;
    return window.matchMedia("(prefers-color-scheme: dark)");
  }, [preference]);

  // Listen for changes in system theme preference
  useEventListener(
    "change",
    (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    },
    mediaQuery,
  );

  // Apply theme whenever preference or accent changes
  useLayoutEffect(() => {
    applyTheme({
      ...(settings.display ?? {}),
      theme: preference,
      accent,
    });

    setCachedValue(THEME_CACHE_KEY, preference);
    setCachedValue(ACCENT_CACHE_KEY, accent);
  }, [preference, accent, resolvedTheme, settings.display]);

  /** Updates the theme preference. */
  const setTheme = (newTheme: ThemeKey) => {
    updateSettings({
      display: { ...(settings.display ?? {}), theme: newTheme },
    });
  };

  /** Updates the accent color. */
  const setAccent = (newAccent: AccentKey) => {
    updateSettings({
      display: { ...(settings.display ?? {}), accent: newAccent },
    });
  };

  return {
    theme: resolvedTheme,
    preference,
    setTheme,
    setPreference: setTheme,
    accent,
    setAccent,
  };
}
