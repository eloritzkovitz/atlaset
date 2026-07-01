import type { DropdownOption } from "@types";
import { DropdownSelectInput } from "../../inputs/DropdownSelectInput/DropdownSelectInput";

interface TableDropdownFilterProps<T> {
  value: T | T[];
  onChange: (v: T | T[]) => void;
  options: DropdownOption<T>[];
  placeholder: string;
  isMulti?: boolean;
  renderOption?: (opt: DropdownOption<T>) => React.ReactNode;
}

export function TableDropdownFilter<T>({
  value,
  onChange,
  options,
  placeholder,
  isMulti = false,
  renderOption,
}: TableDropdownFilterProps<T>) {
  return (
    <DropdownSelectInput<T>
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      isFilter
      isMulti={isMulti}
      className="block w-full text-xs bg-surface/20 rounded-lg"
      renderOption={renderOption}
    />
  );
}
