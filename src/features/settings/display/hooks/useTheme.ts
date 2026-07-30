import { useEffect, useState } from "react";
import { useEventListener } from "@hooks";
import type { ThemeKey, AccentKey } from "../types";
import { applyTheme, resolveTheme } from "../utils/theme";
import { useSettings } from "../../common/hooks/useSettings";

/**
 *  Manages theme-related state and logic.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const preference = (settings.display?.theme ?? "dark") as ThemeKey;
  const accent = (settings.display?.accent ?? "blue") as AccentKey;

  // Track real-time resolved theme (dark vs light) for UI logic
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() =>
    resolveTheme(preference),
  );

  // Apply theme on initial load and whenever preference or accent changes
  useEffect(() => {
    applyTheme(settings.display);
    setResolvedTheme(resolveTheme(preference));
  }, [preference, accent, settings.display]);

  const mediaQuery =
    preference === "system" &&
    typeof window !== "undefined" &&
    window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  // Listen for changes in system theme preference if 'system' is selected
  useEventListener(
    "change",
    (e: MediaQueryListEvent) => {
      const activeTheme = e.matches ? "dark" : "light";
      setResolvedTheme(activeTheme);
      applyTheme({ ...settings.display, theme: "system" });
    },
    mediaQuery,
  );

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
