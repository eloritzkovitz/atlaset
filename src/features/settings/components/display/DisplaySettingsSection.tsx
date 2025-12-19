import { useTheme } from "@features/settings/hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";

export function DisplaySettingsSection() {
  const { theme, toggleTheme } = useTheme();

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
      <div className="space-y-6">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <label className="font-medium" htmlFor="theme-toggle">
              Theme:
            </label>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="mt-2 text-xs text-muted">
            Current theme:{" "}
            <strong>{theme === "dark" ? "Dark" : "Light"}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
