import type { ReactNode } from "react";

interface ProfileFieldProps {
  label: ReactNode;
  children: ReactNode;
}

export function ProfileField({ label, children }: ProfileFieldProps) {
  return (
    <div className="mb-4">
      <div className="text-muted text-xs uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="flex items-center gap-3 text-lg font-medium">
        {children}
      </div>
    </div>
  );
}
