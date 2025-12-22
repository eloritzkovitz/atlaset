import { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useMenuPosition } from "@hooks/useMenuPosition";
import { useClickOutside } from "@hooks/useClickOutside";
import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";
import { DropdownChevron } from "./DropdownChevron";
import { DropdownOptions } from "./DropdownOptions";
import { SelectedOptions } from "./SelectedOptions";
import { InputBox } from "../InputBox/InputBox";

interface DropdownSelectInputProps<T = string> {
  value: T | T[];
  onChange: (value: T | T[]) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  className?: string;
  isFilter?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  renderOption?: (opt: DropdownOption<T>) => React.ReactNode;
}

export function DropdownSelectInput<T = string>({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  isFilter = false,
  isMulti = false,
  disabled = false,
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
      <InputBox
        as="button"
        ref={btnRef}
        type="button"
        className="w-full flex items-center text-left disabled:opacity-50"
        onClick={() => {
          if (options.length === 0) return;
          setOpen((v) => !v);
        }}
        disabled={options.length === 0 || disabled}
        isFilter={isFilter}
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
          <span className="text-muted">{placeholder}</span>
        )}
        <DropdownChevron />
      </InputBox>
      {open &&
        ReactDOM.createPortal(
          <div
            id="dropdown-menu-portal"
            ref={menuRef}
            className={`${
              isFilter ? "mt-3 bg-surface" : "bg-input"
            } border-none rounded max-h-60 w-full overflow-y-auto overflow-x-hidden`}
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
