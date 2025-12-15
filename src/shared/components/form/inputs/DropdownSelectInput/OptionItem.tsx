import type { Option } from "@types";
import { Checkbox } from "../Checkbox";

interface OptionItemProps<T> {
  opt: Option<T>;
  isSelected: (val: T) => boolean;
  isMulti: boolean;
  value: T | T[];
  onChange: (v: T | T[]) => void;
  setOpen: (v: boolean) => void;
  renderOption?: (opt: Option<T>) => React.ReactNode;
}

export function OptionItem<T>({
  opt,
  isSelected,
  isMulti,
  value,
  onChange,
  setOpen,
  renderOption,
}: OptionItemProps<T>) {
  // Toggle handler
  function handleToggle() {
    if (isMulti && Array.isArray(value)) {
      if (value.includes(opt.value)) {
        onChange(value.filter((v) => v !== opt.value));
      } else {
        onChange([...value, opt.value]);
      }
    } else {
      onChange(opt.value);
      setOpen(false);
    }
  }

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 hover:bg-dropdown-hover cursor-pointer ${
        isSelected(opt.value) ? "bg-dropdown-selected font-semibold" : ""
      }`}
      onClick={handleToggle}
    >
      {isMulti && Array.isArray(value) && (
        <Checkbox
          checked={value.includes(opt.value)}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {renderOption ? renderOption(opt) : opt.label}
    </div>
  );
}
