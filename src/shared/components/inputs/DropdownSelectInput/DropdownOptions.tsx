import React from "react";
import type { DropdownOption } from "@types";
import { OptionItem } from "./OptionItem";

interface DropdownOptionsProps<T> {
  options: DropdownOption<T>[];
  isSelected: (value: T) => boolean;
  isMulti: boolean;
  value: T | T[];
  onChange: (value: T | T[]) => void;
  setOpen: (open: boolean) => void;
  renderOption?: (option: DropdownOption<T>) => React.ReactNode;
  activeIndex: number;
  onActiveChange: (index: number) => void;
}

export function DropdownOptions<T>({
  options,
  isSelected,
  isMulti,
  value,
  onChange,
  setOpen,
  renderOption,
  activeIndex,
  onActiveChange,
}: DropdownOptionsProps<T>) {
  let optionIndex = 0;

  return (
    <>
      {options.map((item) => {
        if ("options" in item) {
          return (
            <div key={item.label}>
              <div className="px-3 py-1 text-muted text-xs font-semibold uppercase">
                {item.label}
              </div>

              {item.options.map((option) => {
                const index = optionIndex++;

                return (
                  <OptionItem
                    key={String(option.value)}
                    opt={option}
                    isSelected={isSelected}
                    isMulti={isMulti}
                    value={value}
                    onChange={onChange}
                    setOpen={setOpen}
                    renderOption={renderOption}
                    active={index === activeIndex}
                    onHover={() => onActiveChange(index)}
                  />
                );
              })}
            </div>
          );
        }

        const index = optionIndex++;

        return (
          <OptionItem
            key={String(item.value)}
            opt={item}
            isSelected={isSelected}
            isMulti={isMulti}
            value={value}
            onChange={onChange}
            setOpen={setOpen}
            renderOption={renderOption}
            active={index === activeIndex}
            onHover={() => onActiveChange(index)}
          />
        );
      })}
    </>
  );
}
