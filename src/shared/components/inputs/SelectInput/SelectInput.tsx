import { useId } from "react";
import type { FilterOption } from "@types";
import { DropdownSelectInput } from "../DropdownSelectInput/DropdownSelectInput";

interface SelectInputProps {
  id?: string;
  name?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: FilterOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectInput({
  id,
  name,
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  disabled = false,
  className = "",
}: SelectInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`my-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="font-bold text-sm text-text">
          {label}
        </label>
      )}
      <DropdownSelectInput
        id={inputId}
        name={name || inputId}
        value={value}
        options={options}
        onChange={(val) => {
          if (Array.isArray(val)) {
            onChange(val[0] ?? "");
          } else {
            onChange(val);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
