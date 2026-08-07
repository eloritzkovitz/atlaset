import { useTranslation } from "react-i18next";
import { useAccessibility } from "../hooks/useAccessibility";
import { SettingsToggle } from "../../core/components/SettingsToggle";

export function ShortcutsToggle() {
  const { t } = useTranslation("settings");
  const { singleKeyShortcutsEnabled, setSingleKeyShortcutsEnabled } =
    useAccessibility();

  return (
    <SettingsToggle
      label={t("accessibility.shortcuts.label", "Single-character shortcuts")}
      description={t(
        "accessibility.shortcuts.description",
        "Allows using single-character keys to perform quick actions.",
      )}
      checked={singleKeyShortcutsEnabled}
      onChange={setSingleKeyShortcutsEnabled}
    />
  );
}
