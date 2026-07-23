import React, { useId, type ReactNode } from "react";

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

interface FormInputChildProps {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  children,
  id,
  name,
  className = "",
  disabled = false,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = id || autoId;

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement<FormInputChildProps>(child)) {
      return child;
    }

    const isNativeInput =
      typeof child.type === "string" &&
      ["input", "textarea", "select"].includes(child.type);

    const mergedClassName = [
      child.props.className,
      isNativeInput
        ? "form-field w-full px-3 py-2 bg-input rounded border-none focus:outline-none focus:ring-2 focus:ring-ring-focus"
        : "",
      disabled ? "opacity-60 cursor-not-allowed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return React.cloneElement(child, {
      id: child.props.id || fieldId,
      name: child.props.name || name || fieldId,
      disabled: child.props.disabled ?? disabled,
      className: mergedClassName || undefined,
    });
  });

  return (
    <div
      className={`grid grid-cols-[120px_1fr] items-center gap-2 mb-4 ${
        disabled ? "opacity-60" : ""
      } ${className}`}
    >
      <label htmlFor={fieldId} className="font-semibold text-text select-none">
        {label}
      </label>
      {enhancedChildren}
    </div>
  );
}
