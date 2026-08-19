import { useMemo, useRef, useState } from "react";
import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils";
import { DropdownChevron } from "./DropdownChevron";
import { DropdownOptions } from "./DropdownOptions";
import { SelectedOptions } from "./SelectedOptions";
import { useDropdownNavigation } from "./useDropdownNavigation";
import { InputBox } from "../InputBox/InputBox";
import { DropdownMenu } from "../../navigation/Menu/DropdownMenu";

interface DropdownSelectInputProps<T = string> {
  id?: string;
  name?: string;
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
  id,
  name,
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
  const btnRef = useRef<HTMLButtonElement>(null);

  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  const selectedOption =
    !isMulti && !Array.isArray(value)
      ? flatOptions.find((option) => option.value === value)
      : undefined;

  const isSelected = (val: T) =>
    isMulti && Array.isArray(value) ? value.includes(val) : value === val;

  // Close the dropdown and reset the active index
  const close = () => setOpen(false);

  // Select an option based on its index in the flattened options array
  const selectOption = (index: number) => {
    const option = flatOptions[index];
    if (!option) return;

    if (isMulti && Array.isArray(value)) {
      onChange(
        value.includes(option.value)
          ? value.filter((v) => v !== option.value)
          : [...value, option.value],
      );
      return;
    }

    onChange(option.value);
    close();
    btnRef.current?.focus();
  };

  // Open the dropdown if it's not disabled and there are options available
  const openDropdown = () => {
    if (disabled || !flatOptions.length) return;
    setOpen(true);
  };

  // Toggle the dropdown open or closed
  const toggleDropdown = () => {
    if (open) {
      close();
    } else {
      openDropdown();
    }
  };

  // Determine the index of the currently selected option for keyboard navigation
  const selectedIndex = flatOptions.findIndex((option) =>
    isSelected(option.value),
  );

  // Manage keyboard navigation for the dropdown
  const { activeIndex, setActiveIndex } = useDropdownNavigation({
    open,
    itemCount: flatOptions.length,
    selectedIndex,
    onSelect: selectOption,
    onClose: close,
    triggerRef: btnRef,
    getItemId: (index) =>
      `dropdown-option-${String(flatOptions[index]?.value)}`,
  });

  return (
    <div className={`relative w-full ${className}`}>
      <InputBox
        ref={btnRef}
        id={id}
        name={name}
        type="button"
        as="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-listbox` : undefined}
        className="w-full flex items-center text-left disabled:opacity-50 px-2 hover:bg-surface-hover/50"
        onClick={toggleDropdown}
        disabled={disabled || flatOptions.length === 0}
        isFilter={isFilter}
      >
        {isMulti && Array.isArray(value) && value.length > 0 ? (
          <SelectedOptions
            value={value}
            options={options}
            onRemove={(val) => onChange(value.filter((v) => v !== val))}
          />
        ) : selectedOption ? (
          selectedOption.label
        ) : (
          <span className="text-muted">{placeholder}</span>
        )}

        <DropdownChevron />
      </InputBox>

      <DropdownMenu
        isOpen={open}
        onClose={close}
        triggerRef={btnRef}
        placement="bottom-end"
        offset={4}
        matchTriggerWidth
        className={`${
          isFilter ? "!bg-surface" : "!bg-input"
        } !p-0 !rounded-none max-h-64 overflow-y-auto overflow-x-hidden border-none shadow-lg`}
      >
        <div id={`${id}-listbox`} role="listbox" aria-multiselectable={isMulti}>
          <DropdownOptions
            options={options}
            isSelected={isSelected}
            isMulti={isMulti}
            value={value}
            setOpen={setOpen}
            onChange={onChange}
            renderOption={renderOption}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
          />
        </div>
      </DropdownMenu>
    </div>
  );
}
