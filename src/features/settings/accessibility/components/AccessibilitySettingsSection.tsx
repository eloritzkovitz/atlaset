import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { ShortcutsToggle } from "./ShortcutsToggle";
import { SettingsCard } from "../../common/components/SettingsCard";
import { SettingsToggle } from "../../common/components/SettingsToggle";
import { useAccessibility } from "../hooks/useAccessibility";

export function AccessibilitySettingsSection() {
  const { animationsEnabled, setAnimationsEnabled } = useAccessibility();
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

      <SettingsCard
        title={t("accessibility.motion.title", "Motion")}
        icon={<ICONS.motion />}
      >
        <div className="flex flex-col gap-2 w-full">
          <SettingsToggle
            label={t("accessibility.motion.label", "Animations")}
            description={t(
              "accessibility.motion.description",
              "Toggles fluid transitions, gliding layouts, and sliding menus across the platform. Turn off to reduce motion or improve system speed.",
            )}
            checked={animationsEnabled}
            onChange={setAnimationsEnabled}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
