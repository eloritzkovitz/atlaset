import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { ShortcutsToggle } from "./ShortcutsToggle";
import { SettingsCard } from "../../common/components/SettingsCard";

export function AccessibilitySettingsSection() {
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
          <ShortcutsToggle />
        </div>
      </SettingsCard>
    </div>
  );
}
