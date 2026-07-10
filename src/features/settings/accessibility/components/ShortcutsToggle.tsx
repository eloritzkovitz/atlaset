import { useTranslation } from "react-i18next";
import { Switch } from "@components";
import { useAccessibility } from "../hooks/useAccessibility";

export function ShortcutsToggle() {
  const { t } = useTranslation("settings");
  const { singleKeyShortcutsEnabled, setSingleKeyShortcutsEnabled } =
    useAccessibility();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col text-start gap-1 max-w-xl">
        <p className="font-semibold">
          {t("accessibility.shortcuts.label", "Single-character shortcuts")}
        </p>
        <p className="text-xs text-muted">
          {t(
            "accessibility.shortcuts.description",
            "Allows using single-character keys to perform quick actions.",
          )}
        </p>
      </div>
      <div className="shrink-0">
        <Switch
          checked={singleKeyShortcutsEnabled}
          onChange={setSingleKeyShortcutsEnabled}
        />
      </div>
    </div>
  );
}
