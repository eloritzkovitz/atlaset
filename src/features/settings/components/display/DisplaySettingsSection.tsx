import { FaMoon } from "react-icons/fa6";
import { useTheme } from "@features/settings/hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsCard } from "../SettingsCard";

export function DisplaySettingsSection() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-lg w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">Display Settings</h2>
      <SettingsCard title="Theme" icon={<FaMoon />}>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-4 mb-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="mt-2 text-xs text-muted">
            Current theme:{" "}
            <strong>{theme === "dark" ? "Dark" : "Light"}</strong>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
