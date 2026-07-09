import { useTranslation } from "react-i18next";
import { Checkbox } from "@components";
import { ICONS } from "@constants/icons";
import { useAccessibility } from "../hooks/useAccessibility";
import { SettingsCard } from "../../common/components/SettingsCard";

export function AccessibilitySettingsSection() {
  const { singleKeyShortcutsEnabled, toggleSingleKeyShortcuts } =
    useAccessibility();
  const { t } = useTranslation("settings");

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("accessibility.title", "Accessibility")}
      </h2>

      <SettingsCard
        title={t("accessibility.shortcuts.title", "Shortcuts")}
        icon={<ICONS.shortcuts />}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1 mt-2">
            <Checkbox
              checked={singleKeyShortcutsEnabled}
              onChange={toggleSingleKeyShortcuts}
              label={t(
                "accessibility.shortcuts.enable",
                "Enable single-character shortcuts",
              )}
            />
            <p className="text-xs opacity-70 ps-7">
              {t(
                "accessibility.shortcuts.description",
                "Allows using single-character keys to perform quick actions.",
              )}
            </p>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
