import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import type { ViewMode } from "@types";
import { Tooltip } from "../../overlay/Tooltip/Tooltip";

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
  const { t } = useTranslation("common");

  const modesConfig = [
    {
      id: "grid" as ViewMode,
      label: t("viewMode.grid", "Grid View"),
      Icon: ICONS.viewMode.grid,
      roundingClass: "rounded-l-full",
    },
    {
      id: "list" as ViewMode,
      label: t("viewMode.list", "List View"),
      Icon: ICONS.viewMode.list,
      roundingClass: "rounded-r-full",
    },
  ];

  const baseButtonClass =
    "flex h-8 w-10 items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10";
  const activeClass =
    "bg-primary text-primary-foreground shadow-sm font-medium";
  const inactiveClass =
    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-input-hover";

  return (
    <div
      role="group"
      aria-label={t("exploration.viewOptions", "View options")}
      className={`inline-flex items-center overflow-hidden rounded-full bg-muted/40 ${className}`}
    >
      {modesConfig.map(({ id, label, Icon, roundingClass }, index) => {
        const isActive = viewMode === id;

        return (
          <div key={id} className="flex items-center">
            {index > 0 && <div className="h-6 w-[1px] bg-muted/40" />}

            <Tooltip content={label} position="bottom">
              <button
                type="button"
                onClick={() => onChange(id)}
                aria-label={label}
                aria-pressed={isActive}
                className={`${baseButtonClass} ${roundingClass} ${isActive ? activeClass : inactiveClass}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
