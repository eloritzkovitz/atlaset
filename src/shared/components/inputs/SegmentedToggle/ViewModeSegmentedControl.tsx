import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import type { ViewMode } from "@types";
import { ActionButton } from "../Button/ActionButton";

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
      roundingClass: "rounded-s-full",
    },
    {
      id: "list" as ViewMode,
      label: t("viewMode.list", "List View"),
      Icon: ICONS.viewMode.list,
      roundingClass: "rounded-e-full",
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

        const combinedButtonClass = `${baseButtonClass} ${isActive ? activeClass : inactiveClass} ${roundingClass} 
          focus:outline-none 
          focus-visible:z-30 
          focus-visible:ring-2 
          focus-visible:ring-inset 
          focus-visible:ring-ring
        `;

        return (
          <div key={id} className="flex items-center">
            {index > 0 && <div className="h-8 w-[1px] bg-muted/40" />}

            <ActionButton
              variant="custom"
              className={combinedButtonClass}
              ariaLabel={label}
              title={label}
              titlePosition="bottom"
              onClick={() => onChange(id)}
              icon={<Icon className="h-4 w-4" />}
              aria-pressed={isActive}
            />
          </div>
        );
      })}
    </div>
  );
}
