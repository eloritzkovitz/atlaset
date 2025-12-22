import type { FilterOption } from "@types";
import { DropdownSelectInput } from "./DropdownSelectInput/DropdownSelectInput";

interface SelectInputProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: FilterOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectInput({
  value,
  onChange,
  options,
  label,
  placeholder = "Select...",
  disabled = false,
  className = "",
}: SelectInputProps) {
  return (
    <div className={`my-4 ${className}`}>
      {label && <label className="font-bold block mb-2">{label}</label>}
      <DropdownSelectInput
        options={options}
        value={value}
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
