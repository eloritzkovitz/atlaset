import React from "react";
import { FaXmark } from "react-icons/fa6";

interface ChipProps {
  children: React.ReactNode;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Chip({
  children,
  removable,
  onClick,
  onRemove,
  className = "",
  disabled,
}: ChipProps) {
  const defaultStyle =
    "bg-chip-bg hover:bg-info-hover text-chip-text rounded-xl flex items-center gap-1 px-2 py-1 text-sm me-1 mb-1";

  return (
    <span
      className={`${defaultStyle}${className ? ` ${className}` : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {removable && (
        <button
          type="button"
          className={`ms-auto text-muted ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-muted-hover"
          }`}
          onClick={onRemove}
          disabled={disabled}
        >
          <FaXmark />
        </button>
      )}
    </span>
  );
}
