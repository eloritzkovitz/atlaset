import type { ReactNode } from "react";
import { SectionHeader } from "@components";

interface ProfileFieldProps {
  label: ReactNode;
  children: ReactNode;
}

export function ProfileField({ label, children }: ProfileFieldProps) {
  return (
    <div className="mb-2">
      <SectionHeader>{label}</SectionHeader>
      <div className="flex items-center gap-3 text-lg font-medium">
        {children}
      </div>
    </div>
  );
}
