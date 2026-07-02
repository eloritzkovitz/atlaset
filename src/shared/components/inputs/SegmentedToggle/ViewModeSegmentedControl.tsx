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
    "flex h-10 w-12 items-center justify-center transition-all duration-200";
  const activeClass = "bg-primary shadow-sm font-medium z-20";
  const inactiveClass =
    "bg-transparent hover:text-foreground hover:bg-input-hover";

  return (
    <div
      role="group"
      className={`inline-flex items-center isolate rounded-full bg-muted/40 ${className}`}
    >
      {modesConfig.map(({ id, label, Icon, roundingClass }, index) => {
        const isActive = viewMode === id;

        return (
          <div key={id} className="flex items-center">
            {index > 0 && <div className="h-8 w-[1px] bg-muted/40" />}

            <div
              className={`relative inline-flex items-center ${roundingClass} focus-within:z-30`}
            >
              <Tooltip content={label} position="bottom">
                <button
                  type="button"
                  onClick={() => onChange(id)}
                  aria-label={label}
                  aria-pressed={isActive}
                  className={`${baseButtonClass} ${isActive ? activeClass : inactiveClass} ${roundingClass} 
                    focus:outline-none 
                    focus-visible:z-30 
                    focus-visible:ring-2 
                    focus-visible:ring-inset 
                    focus-visible:ring-ring
                  `}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
}
