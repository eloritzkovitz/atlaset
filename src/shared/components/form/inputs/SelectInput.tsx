import type { FilterOption } from "@types";
import { InputBox } from "./InputBox/InputBox";
import { DropdownChevron } from "./DropdownSelectInput/DropdownChevron";

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
        <InputBox
          as="select"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChange(e.target.value)
          }
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </InputBox>
        <DropdownChevron />
      </div>
    </div>
  );
}
