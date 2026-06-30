import React, { type ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface CollapsibleHeaderProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  count?: number | React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
  className?: string;
}

export function CollapsibleHeader({
  icon,
  label,
  count,
  expanded,
  onToggle,
  children,
  className = "",
}: CollapsibleHeaderProps) {
  const labelText = typeof label === "string" ? label : "section";
  const toggleLabel = `${expanded ? "Collapse" : "Expand"} ${labelText}`;

  return (
    <div className="w-full mb-4">
      <div
        className={`flex items-center justify-between select-none cursor-pointer group ${className}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <span className="flex items-center gap-2 h-8 text-lg font-bold">
          {icon}
          <span className="inline-flex items-center gap-2">
            <span>{label}</span>
            {count !== undefined && (
              <span className="text-muted">({count})</span>
            )}
          </span>
        </span>

        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          ariaLabel={toggleLabel}
          title={toggleLabel}
          icon={expanded ? <FaChevronUp /> : <FaChevronDown />}
          rounded
        />
      </div>
      {expanded && children}
    </div>
  );
}
