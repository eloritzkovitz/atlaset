import React from "react";
import { Tooltip } from "@components";
import { ICONS } from "@constants/icons";

interface SettingsRowProps {
  label: string;
  description?: string;
  tooltip?: string;
  control: React.ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
}

export function SettingsRow({
  label,
  description,
  tooltip,
  control,
  labelClassName = "font-semibold",
  descriptionClassName = "text-xs text-muted",
}: SettingsRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="text-start max-w-xl">
        <span className={`${labelClassName} inline`}>
          <span>{label}</span>

          {tooltip && (
            <Tooltip content={tooltip} position="top">
              <div className="inline-flex align-middle ms-2 text-muted hover:text-muted-hover transition-colors cursor-help">
                <ICONS.info />
              </div>
            </Tooltip>
          )}
        </span>

        {description && <p className={descriptionClassName}>{description}</p>}
      </div>
      <div className="shrink-0 w-full sm:w-auto">{control}</div>
    </div>
  );
}
