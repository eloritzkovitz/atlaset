import { FaBrush } from "react-icons/fa6";
import { ThemeToggle } from "./ThemeToggle";
import { SettingsCard } from "../SettingsCard";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

export function DisplaySettingsSection() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation("settings");

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">{t("display.title")}</h2>
      <SettingsCard title={t("display.theme.title")} icon={<FaBrush />}>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-4 mb-2">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="mt-2 text-xs text-muted">
            {t("display.current")} {" "}
            <strong>{theme === "dark" ? t("display.theme.dark") : t("display.theme.light")}</strong>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
