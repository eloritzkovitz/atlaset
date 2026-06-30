import { type ComponentType, type InputHTMLAttributes } from "react";
import "./InputBox.css";

interface InputBoxProps {
  as?: ComponentType<InputHTMLAttributes<HTMLInputElement>> | string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
      } w-full py-2 rounded border-none mt-1 focus:outline-none focus:ring-2 focus:ring-ring-focus ${className}`}
      disabled={disabled}
      {...props}
    />
  );
}
