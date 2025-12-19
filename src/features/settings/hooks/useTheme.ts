import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages theme settings.
 * @returns Current theme, a setter, and a toggle function.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  // Fallback to "dark" if display or theme is undefined
  const theme = settings.display?.theme ?? "dark";

  // Set the theme to either "light" or "dark"
  const setTheme = (theme: "light" | "dark") =>
    updateSettings({ display: { theme } });

  // Toggle between "light" and "dark" themes
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return { theme, setTheme, toggleTheme };
}
