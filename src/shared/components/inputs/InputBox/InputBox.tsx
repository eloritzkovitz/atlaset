import { type ComponentType, type InputHTMLAttributes } from "react";
import "./InputBox.css";

interface InputBoxProps {
  as?: ComponentType<InputHTMLAttributes<HTMLInputElement>> | string;
  className?: string;
  [key: string]: unknown;
  isFilter?: boolean;
  disabled?: boolean;
  maxLength?: number;
  value?: string | number | readonly string[];
}

export function InputBox({
  as: Component = "input",
  className = "",
  isFilter = false,
  disabled = false,
  maxLength,
  value,
  ...props
}: InputBoxProps) {
  const hasCharacterLimit = maxLength !== undefined;
  const characterCount = typeof value === "string" ? value.length : 0;

  return (
    <div className="w-full">
      <Component
        className={`input-box ${
          !isFilter ? "px-3 bg-input hover:bg-input-hover" : ""
        } w-full py-2 rounded-xl border-none mt-1 focus:outline-none ${className}`}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        {...props}
      />

      {hasCharacterLimit && (
        <div
          className={`mt-1 pe-2 text-end text-xs ${
            characterCount >= maxLength ? "text-danger" : "text-muted"
          }`}
        >
          {characterCount} / {maxLength}
        </div>
      )}
    </div>
  );
}
