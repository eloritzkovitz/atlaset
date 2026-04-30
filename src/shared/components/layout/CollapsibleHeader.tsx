import React, { type ReactNode } from "react";
import { useIsRtl } from "@hooks";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { ActionButton } from "../action/ActionButton";

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
  const isRtl = useIsRtl();
  const labelText = typeof label === "string" ? label : "section";

  // If count is provided, display it next to the label in a muted style
  const labelNode: ReactNode =
    count !== undefined ? (
      isRtl ? (
        <span className="inline-flex items-center gap-2" dir="ltr">
          <span className="text-muted">({count})</span>
          <span dir="rtl">{label}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          <span>{label}</span>
          <span dir="ltr" className="text-muted">
            ({count})
          </span>
        </span>
      )
    ) : (
      label
    );

  return (
    <div className="w-full mb-4">
      <div
        className={`flex items-center justify-between select-none ${className}`}
      >
        <span
          className="flex items-center gap-2 h-8 text-lg font-bold cursor-pointer"
          onClick={onToggle}
          tabIndex={0}
          role="button"
          aria-pressed={expanded}
        >
          {icon}
          {labelNode}
        </span>
        <ActionButton
          onClick={onToggle}
          ariaLabel={expanded ? `Collapse ${labelText}` : `Expand ${labelText}`}
          icon={expanded ? <FaChevronUp /> : <FaChevronDown />}
          rounded
        />
      </div>
      {expanded && children}
    </div>
  );
}
