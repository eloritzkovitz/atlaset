import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import type { ViewMode } from "@types";

interface ViewModeSegmentedControlProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeSegmentedControl({
  viewMode,
  onChange,
  className = "",
}: ViewModeSegmentedControlProps) {
  const { t } = useTranslation("dashboard");

  const baseButtonClass =
    "flex h-8 w-10 items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10";
  const activeClass =
    "bg-primary text-primary-foreground shadow-sm font-medium";
  const inactiveClass =
    "bg-transparent text-muted-foreground hover:text-foreground";

  return (
    <div
      role="group"
      aria-label={t("exploration.viewOptions", "View options")}
      className={`inline-flex items-center overflow-hidden rounded-full bg-muted/40 ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label={t("exploration.switchToGrid", "Switch to Grid View")}
        title={t("exploration.switchToGrid", "Grid View")}
        aria-pressed={viewMode === "grid"}
        className={`${baseButtonClass} rounded-l-full ${viewMode === "grid" ? activeClass : inactiveClass}`}
      >
        <ICONS.viewMode.grid className="h-4 w-4" />
      </button>

      <div className="h-6 bg-muted" />

      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label={t("exploration.switchToList", "Switch to List View")}
        title={t("exploration.switchToList", "List View")}
        aria-pressed={viewMode === "list"}
        className={`${baseButtonClass} rounded-r-full ${viewMode === "list" ? activeClass : inactiveClass}`}
      >
        <ICONS.viewMode.list className="h-4 w-4" />
      </button>
    </div>
  );
}
