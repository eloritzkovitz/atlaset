import { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa6";
import ReactDOM from "react-dom";
import { useClickOutside } from "@hooks/useClickOutside";
import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";
import { OptionItem } from "./OptionItem";
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
  const [menuPos, setMenuPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
        type="button"
        className="w-full flex items-center text-left disabled:opacity-50"
        onClick={(e) => {
          if (options.length === 0) return;
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setMenuPos({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
          });
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
        menuPos &&
        ReactDOM.createPortal(
          <div
            id="dropdown-menu-portal"
            ref={menuRef}
            className="absolute z-[9999] bg-white border rounded shadow max-h-60 overflow-y-auto overflow-x-hidden min-w-[150px] mt-1"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              position: "absolute",
            }}
          >
            {options.map((optOrGroup) =>
              "options" in optOrGroup ? (
                <div key={optOrGroup.label}>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                    {optOrGroup.label}
                  </div>
                  {optOrGroup.options.map((opt) => (
                    <OptionItem
                      key={String(opt.value)}
                      opt={opt}
                      isSelected={isSelected}
                      isMulti={isMulti}
                      value={value}
                      onChange={onChange}
                      setOpen={setOpen}
                      renderOption={renderOption}
                    />
                  ))}
                </div>
              ) : (
                <OptionItem
                  key={String(optOrGroup.value)}
                  opt={optOrGroup}
                  isSelected={isSelected}
                  isMulti={isMulti}
                  value={value}
                  onChange={onChange}
                  setOpen={setOpen}
                  renderOption={renderOption}
                />
              )
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
