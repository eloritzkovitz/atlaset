import React from "react";

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "custom";
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "px-4 py-2 rounded font-semibold focus:outline-none transition-colors";
  const styles =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary-hover"
      : variant === "secondary"
      ? "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
      : "";
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  return (
    <button
      className={`${base} ${styles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
