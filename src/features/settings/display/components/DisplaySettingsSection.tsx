import { useTranslation } from "react-i18next";
import { FaBrush } from "react-icons/fa6";
import { Checkbox } from "@components";
import { ThemePreview } from "./ThemePreview";
import { useTheme } from "../hooks/useTheme";
import { SettingsCard } from "../../common/components/SettingsCard";

export function DisplaySettingsSection() {
  const { theme, preference, setPreference } = useTheme();
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
            onSelect={(k) => setPreference(k)}
          />
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={preference === "system"}
              onChange={(checked) => setPreference(checked ? "system" : theme)}
              label={t(
                "display.theme.syncWithSystem",
                "Sync with device theme",
              )}
            />
            {preference === "system" ? (
              <span className="text-xs opacity-70 ms-auto">
                {t(
                  "display.theme.followingSystem",
                  "Follows system preference",
                )}
              </span>
            ) : null}
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
