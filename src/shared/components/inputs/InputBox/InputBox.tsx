import { type ComponentType, type InputHTMLAttributes } from "react";
import "./InputBox.css";

interface InputBoxProps {
  as?: ComponentType<InputHTMLAttributes<HTMLInputElement>> | string;
  className?: string;
  [key: string]: unknown;
  isFilter?: boolean;
  disabled?: boolean;
}

export function InputBox({
  as: Component = "input",
  className = "",
  isFilter = false,
  disabled = false,
  ...props
}: InputBoxProps) {
  return (
    <Component
      className={`input-box ${
        !isFilter ? "px-3 bg-input hover:bg-input-hover" : ""
      } w-full py-2 rounded-xl border-none mt-1 focus:outline-none ${className}`}
      disabled={disabled}
      {...props}
    />
  );
}
