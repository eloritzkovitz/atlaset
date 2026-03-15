import React from "react";
import { InputBox, SelectInput } from "@components";

interface CurrencyInputRowProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectValue: string;
  onSelectChange: (value: string | number) => void;
  selectOptions: { label: string; value: string }[];
  selectPlaceholder: string;
  readOnly?: boolean;
  inputAriaLabel?: string;
  selectAriaLabel?: string;
}

export function CurrencyInputRow({
  value,
  onChange,
  selectValue,
  onSelectChange,
  selectOptions,
  selectPlaceholder,
  readOnly = false,
  inputAriaLabel,
  selectAriaLabel,
}: CurrencyInputRowProps) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-input bg-input h-12">
      <div className="w-1/2 h-full flex items-center">
        <InputBox
          type="number"
          value={value}
          min={0}
          onChange={onChange}
          readOnly={readOnly}
          className="w-full text-lg border-none bg-transparent px-3 h-full focus:ring-0"
          aria-label={inputAriaLabel}
        />
      </div>
      <div className="h-full w-px bg-muted/40"></div>
      <div className="w-1/2 h-full flex items-center">
        <SelectInput
          value={selectValue}
          onChange={onSelectChange}
          options={selectOptions}
          placeholder={selectPlaceholder}
          className="w-full border-none bg-transparent px-3 h-full"
          aria-label={selectAriaLabel}
        />
      </div>
    </div>
  );
}
