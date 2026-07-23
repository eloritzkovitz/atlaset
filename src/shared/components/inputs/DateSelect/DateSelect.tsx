import React, { useId, useRef } from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { InputBox } from "../InputBox/InputBox";
import "./DateSelect.css";

interface DateSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  label?: string;
  className?: string;
}

export function DateSelect({
  id,
  name,
  label,
  className = "",
  ...props
}: DateSelectProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block mb-1 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <InputBox
          id={inputId}
          name={name || inputId}
          ref={inputRef}
          type="date"
          {...props}
        />
        <FaRegCalendar
          className="w-4 h-4 text-muted absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() =>
            inputRef.current?.showPicker?.() || inputRef.current?.focus()
          }
        />
      </div>
    </div>
  );
}
