import type { ReactNode } from "react";

interface FieldLabelProps {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

/** Renders a form field label with an optional required indicator. */
export function FieldLabel({
  children,
  required = false,
  htmlFor,
  className = "",
}: FieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`font-semibold text-text select-none ${className}`}
    >
      {children}
      {required && (
        <span className="text-danger ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
