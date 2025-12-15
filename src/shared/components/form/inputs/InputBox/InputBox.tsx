import { type ComponentType, type InputHTMLAttributes } from "react";
import "./InputBox.css";

interface InputBoxProps {
  as?: ComponentType<InputHTMLAttributes<HTMLInputElement>> | string;
  className?: string;
  [key: string]: any;
  isFilter?: boolean;
}

export function InputBox({
  as: Component = "input",
  className = "",
  isFilter = false,
  ...props
}: InputBoxProps) {
  return (
    <Component
      className={`input-box ${
        !isFilter ? "px-3 bg-input hover:bg-input-hover" : ""
      } w-full py-2 rounded border-none mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${className}`}
      {...props}
    />
  );
}
