import React from "react";
import { FaXmark } from "react-icons/fa6";

interface ChipProps {
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Chip({
  children,
  removable,
  onRemove,
  className = "",
  disabled,
}: ChipProps) {
  const defaultStyle =
    "bg-blue-100 text-blue-800 dark:bg-gray-500 dark:text-gray-200 rounded-xl flex items-center gap-1 px-2 py-1 text-sm mr-1 mb-1";

  return (
    <span className={`${defaultStyle}${className ? ` ${className}` : ""}`}>
      {children}
      {removable && (
        <button
          type="button"
          className={`ml-auto text-gray-400 ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue-500 dark:hover:text-gray-300"
          }`}
          title="Remove"
          onClick={onRemove}
          disabled={disabled}
        >
          <FaXmark />
        </button>
      )}
    </span>
  );
}
