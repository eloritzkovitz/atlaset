import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useKeyboardFocusRing } from "@hooks/useKeyboardFocusRing";
import { ActionButton } from "../../action/ActionButton";

interface ToolbarSelectButtonProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: React.ReactNode }[];
  ariaLabel: string;
  width?: string;
}

export function ToolbarSelectButton<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
  width = "150px",
}: ToolbarSelectButtonProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const showRing = useKeyboardFocusRing();

  return (
    <ActionButton
      ariaLabel={ariaLabel}
      title={ariaLabel}
      style={{ width, height: "48px", padding: 0 }}
      className={isFocused && showRing ? "ring-2 ring-blue-500" : ""}
      variant="action"
      rounded
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-full text-center bg-gray-700 border border-gray-600 rounded-full appearance-none text-blue-800 dark:text-white font-semibold outline-none p-0 m-0 bg-inherit shadow-none border-none select-none"
        aria-label={ariaLabel}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="ml-5" />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-800 dark:text-white">
        <FaChevronDown />
      </span>
    </ActionButton>
  );
}
