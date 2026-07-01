import React from "react";
import type { DropdownOption } from "@types";
import { OptionItem } from "./OptionItem";

interface DropdownOptionsProps<T> {
  options: DropdownOption<T>[];
  isSelected: (val: T) => boolean;
  isMulti: boolean;
  value: T | T[];
  onChange: (value: T | T[]) => void;
  setOpen: (open: boolean) => void;
  renderOption?: (opt: DropdownOption<T>) => React.ReactNode;
}

export function DropdownOptions<T>({
  options,
  isSelected,
  isMulti,
  value,
  onChange,
  setOpen,
  renderOption,
}: DropdownOptionsProps<T>) {
  return (
    <>
      {options.map((optOrGroup) =>
        "options" in optOrGroup ? (
          <div key={optOrGroup.label}>
            <div className="px-3 py-1 text-muted text-xs font-semibold uppercase">
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
    </>
  );
}
