import React, { type ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { ActionButton } from "../action/ActionButton";

interface CollapsibleHeaderProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
  className?: string;
}

export function CollapsibleHeader({
  icon,
  label,
  expanded,
  onToggle,
  children,
  className = "",
}: CollapsibleHeaderProps) {
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
          {label}
        </span>
        <ActionButton
          onClick={onToggle}
          ariaLabel={expanded ? `Collapse ${label}` : `Expand ${label}`}
          icon={expanded ? <FaChevronUp /> : <FaChevronDown />}
          rounded
        />
      </div>
      {expanded && children}
    </div>
  );
}
