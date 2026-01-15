import React from "react";
import { FaXmark } from "react-icons/fa6";

interface ChipProps {
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
  noButton?: boolean;
}

export function Chip({
  children,
  removable,
  onRemove,
  className = "",
  disabled,
  noButton,
}: ChipProps) {
  const defaultStyle =
    "bg-chip-bg hover:bg-info-hover text-chip-text rounded-xl flex items-center gap-1 px-2 py-1 text-sm mr-1 mb-1";

  return (
    <span className={`${defaultStyle}${className ? ` ${className}` : ""}`}>
      {children}
      {removable &&
        (noButton ? (
          <span
            role="button"
            tabIndex={0}
            className={`ml-auto text-muted ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-muted-hover"
            }`}
            title="Remove"
            onClick={disabled ? undefined : onRemove}
            onKeyDown={
              disabled
                ? undefined
                : (e) => {
                    if (e.key === "Enter" || e.key === " ") onRemove?.();
                  }
            }
            aria-disabled={disabled}
          >
            <FaXmark />
          </span>
        ) : (
          <button
            type="button"
            className={`ml-auto text-muted ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-muted-hover"
            }`}
            title="Remove"
            onClick={onRemove}
            disabled={disabled}
          >
            <FaXmark />
          </button>
        ))}
    </span>
  );
}
