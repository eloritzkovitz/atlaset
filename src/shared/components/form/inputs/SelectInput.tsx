import type { FilterOption } from "@types";
import { DropdownSelectInput } from "./DropdownSelectInput/DropdownSelectInput";

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
        placeholder="Select..."
      />
    </div>
  );
}
