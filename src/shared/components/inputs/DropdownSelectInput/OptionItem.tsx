import type { Option } from "@types";
import { Checkbox } from "../Checkbox/Checkbox";

interface OptionItemProps<T> {
  opt: Option<T>;
  isSelected: (value: T) => boolean;
  isMulti: boolean;
  value: T | T[];
  onChange: (value: T | T[]) => void;
  setOpen: (open: boolean) => void;
  renderOption?: (option: Option<T>) => React.ReactNode;
  active?: boolean;
  onHover?: () => void;
}

export function OptionItem<T>({
  opt,
  isSelected,
  isMulti,
  value,
  onChange,
  setOpen,
  renderOption,
  active = false,
  onHover,
}: OptionItemProps<T>) {
  function handleToggle() {
    if (isMulti && Array.isArray(value)) {
      onChange(
        value.includes(opt.value)
          ? value.filter((v) => v !== opt.value)
          : [...value, opt.value],
      );
      return;
    }

    onChange(opt.value);
    setOpen(false);
  }

  return (
    <button
      id={`dropdown-option-${String(opt.value)}`}
      type="button"
      role="option"
      aria-selected={isSelected(opt.value)}
      className={`w-full flex items-center gap-2 px-2 py-1 text-start rounded ${
        active ? "bg-primary-hover" : ""
      } ${isSelected(opt.value) ? "bg-primary font-semibold" : ""}`}
      onMouseEnter={onHover}
      onClick={handleToggle}
    >
      {isMulti && Array.isArray(value) && (
        <Checkbox
          checked={value.includes(opt.value)}
          onChange={() => {}}
          aria-hidden
        />
      )}

      {renderOption ? renderOption(opt) : opt.label}
    </button>
  );
}
