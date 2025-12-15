import type { ReactNode } from "react";

interface ProfileFieldProps {
  label: string;
  children: ReactNode;
}

export function ProfileField({ label, children }: ProfileFieldProps) {
  return (
    <div className="mb-4">
      <span className="text-muted text-xs uppercase tracking-wide">
        {label}
      </span>
      <div className="text-lg font-medium">
        {children}
      </div>
    </div>
  );
}
