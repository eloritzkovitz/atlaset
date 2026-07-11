import React from "react";

interface SettingsRowProps {
  label: string;
  description?: string;
  control: React.ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
}

export function SettingsRow({
  label,
  description,
  control,
  labelClassName = "font-semibold",
  descriptionClassName = "text-xs text-muted",
}: SettingsRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col text-start gap-1 max-w-xl">
        <p className={labelClassName}>{label}</p>
        {description && <p className={descriptionClassName}>{description}</p>}
      </div>
      <div className="shrink-0 w-full sm:w-auto">{control}</div>
    </div>
  );
}
