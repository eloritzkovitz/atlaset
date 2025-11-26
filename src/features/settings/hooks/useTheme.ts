import { useSettings } from "@contexts/SettingsContext";

/**
 * Manages theme settings.
 * @returns Current theme, a setter, and a toggle function.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings();
  const setTheme = (theme: "light" | "dark") => updateSettings({ theme });
  const toggleTheme = () =>
    setTheme(settings.theme === "dark" ? "light" : "dark");
  return { theme: settings.theme, setTheme, toggleTheme };
}
