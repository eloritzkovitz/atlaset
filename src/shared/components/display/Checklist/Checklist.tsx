import React from "react";
import { ICONS } from "@constants/icons";
import { capitalize } from "@utils";

export interface ChecklistItem {
  label: string;
  completed: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  renderIcon?: (completed: boolean) => React.ReactNode;
  className?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  renderIcon,
  className,
}) => {
  if (!items.length) return null;
  return (
    <div className="flex flex-col items-start w-full mt-4 mb-2">
      <div className={className || "ms-12 flex flex-col gap-2 items-start"}>
        {items.map((item, idx) => (
          <div
            key={item.label + idx}
            className="flex items-center gap-2 text-sm"
          >
            {renderIcon ? (
              renderIcon(item.completed)
            ) : item.completed ? (
              <span className="text-success" title="Completed">
                <ICONS.selected style={{ verticalAlign: "middle" }} />
              </span>
            ) : (
              <span style={{ width: "1em", display: "inline-block" }}></span>
            )}
            <span className={item.completed ? "" : "text-muted"}>
              {capitalize(item.label)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
