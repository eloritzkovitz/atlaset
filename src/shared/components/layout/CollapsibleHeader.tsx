import React, { type ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ActionButton } from "@components";

interface CollapsibleHeaderProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function CollapsibleHeader({
  icon,
  label,
  expanded,
  onToggle,
  children,
}: CollapsibleHeaderProps) {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 h-8 text-lg font-bold">
          {icon}
          {label}
        </span>
        <ActionButton
          onClick={onToggle}
          ariaLabel={expanded ? `Collapse ${label}` : `Expand ${label}`}
          title={expanded ? `Collapse ${label}` : `Expand ${label}`}
          icon={expanded ? <FaChevronUp /> : <FaChevronDown />}
          rounded
        />
      </div>
      {expanded && children}
    </div>
  );
}
