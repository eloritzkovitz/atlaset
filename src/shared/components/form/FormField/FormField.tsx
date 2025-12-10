import type { ReactNode } from "react";
import "./FormField.css";

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FormField({ label, children, className = "" }: FormFieldProps) {
  return (
    <div className={`grid grid-cols-[120px_1fr] items-center gap-2 mb-4 ${className}`}>
      <label className="font-semibold text-gray-700">{label}</label>
      {children}
    </div>
  );
}