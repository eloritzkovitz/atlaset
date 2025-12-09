import { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import ReactDOM from "react-dom";
import { useMenuPosition } from "@hooks/useMenuPosition";
import { useClickOutside } from "@hooks/useClickOutside";
import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";
import { DropdownOptions } from "./DropdownOptions";
import { SelectedOptions } from "./SelectedOptions";

interface DropdownSelectInputProps<T = string> {
  value: T | T[];
  onChange: (value: T | T[]) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  className?: string;
  isMulti?: boolean;
  renderOption?: (opt: any) => React.ReactNode;
}

export function DropdownSelectInput<T = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  isMulti = false,
  renderOption,
}: DropdownSelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Dynamically calculate offset based on button height
  const btnHeight = btnRef.current?.offsetHeight ?? 0;
  const menuStyle = useMenuPosition(open, btnRef, menuRef, btnHeight);

  // Close dropdown on outside click
  useClickOutside(
    [
      ref as React.RefObject<HTMLElement>,
      menuRef as React.RefObject<HTMLElement>,
    ],
    () => setOpen(false),
    open
  );

  // For multi-select, value is T[]
  const isSelected = (val: T) =>
    isMulti && Array.isArray(value) ? value.includes(val) : value === val;

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="w-full flex items-center text-left disabled:opacity-50"
        onClick={() => {
          if (options.length === 0) return;
          setOpen((v) => !v);
        }}
        disabled={options.length === 0}
      >
        {isMulti && Array.isArray(value) && value.length > 0 ? (
          <SelectedOptions
            value={value}
            options={options}
            onRemove={(val) => onChange(value.filter((v) => v !== val))}
          />
        ) : !isMulti &&
          flattenOptions(options).find((opt) => opt.value === value) ? (
          flattenOptions(options).find((opt) => opt.value === value)?.label
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="chevron-container">
          <FaChevronDown />
        </span>
      </button>
      {open &&
        ReactDOM.createPortal(
          <div
            id="dropdown-menu-portal"
            ref={menuRef}
            className="bg-white border-none rounded shadow-md max-h-60 overflow-y-auto overflow-x-hidden mt-3"
            style={{
              ...menuStyle,
              zIndex: 11000,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownOptions
              options={options}
              isSelected={isSelected}
              isMulti={isMulti}
              value={value}
              onChange={onChange}
              setOpen={setOpen}
              renderOption={renderOption}
            />
          </div>,
          document.body
        )}
    </div>
  );
}
