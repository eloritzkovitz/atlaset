import type { FilterOption } from "@types";
import { DropdownChevron } from "./Dropdown/DropdownChevron";
import "./SelectInput.css";

interface SelectInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: FilterOption[];
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
}: SelectInputProps) {
  return (
    <div className="my-4">
      <label className="font-bold block mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-input bg-input"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <DropdownChevron />
      </div>
    </div>
  );
}
