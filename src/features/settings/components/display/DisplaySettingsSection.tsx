import { useTranslation } from "react-i18next";
import { FaBrush } from "react-icons/fa6";
import { ThemePreview } from "./ThemePreview";
import { SettingsCard } from "../SettingsCard";
import { useTheme } from "../../hooks/useTheme";

export function DisplaySettingsSection() {
  const { theme } = useTheme();
  const { t } = useTranslation("settings");

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("display.title")}
      </h2>
      <SettingsCard title={t("display.theme.title")} icon={<FaBrush />}>
        <div className="flex flex-col gap-2 w-full">
          <ThemePreview
            labels={{
              light: t("display.theme.light"),
              dark: t("display.theme.dark"),
            }}
            activeTheme={theme}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
