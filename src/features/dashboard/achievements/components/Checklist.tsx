import React from "react";
import { FaCheck } from "react-icons/fa6";

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
  return (
    <div className={className || "flex flex-col gap-2 items-start"}>
      {items.map((item, idx) => (
        <div key={item.label + idx} className="flex items-center gap-2 text-sm">
          {renderIcon ? (
            renderIcon(item.completed)
          ) : item.completed ? (
            <span className="text-success" title="Completed">
              <FaCheck style={{ verticalAlign: "middle" }} />
            </span>
          ) : (
            <span style={{ width: "1em", display: "inline-block" }}></span>
          )}
          <span className={item.completed ? "" : "text-muted"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};
