import type { ReactNode } from "react";
import React from "react";

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  children,
  className = "",
  disabled = false,
}: FormFieldProps) {
  const enhancedChildren = React.Children.map(children, (child) => {
    if (
      React.isValidElement<{ className?: string }>(child) &&
      ["input", "textarea", "select"].includes(
        typeof child.type === "string" ? child.type : ""
      )
    ) {
      return React.cloneElement(child, {
        className: [
          child.props.className,
          "form-field w-full px-3 py-2 bg-input rounded border-none focus:outline-none focus:ring-2 focus:ring-ring-focus",
          disabled ? "opacity-60 cursor-not-allowed" : "",
        ]
          .filter(Boolean)
          .join(" "),
      });
    }
    return child;
  });

  return (
    <div
      className={`grid grid-cols-[120px_1fr] items-center gap-2 mb-4 ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <label className="font-semibold text-text">{label}</label>
      {enhancedChildren}
    </div>
  );
}
