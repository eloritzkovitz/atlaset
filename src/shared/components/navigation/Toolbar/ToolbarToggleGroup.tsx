import type { ToolbarToggleOption } from "@types";
import { ActionButton } from "../../inputs/Button/ActionButton";

interface ToolbarToggleGroupProps {
  options: ToolbarToggleOption[];
  className?: string;
}

export function ToolbarToggleGroup({
  options,
  className,
}: ToolbarToggleGroupProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {options.map((opt) => (
        <ActionButton
          key={opt.value}
          onClick={opt.onClick}
          ariaLabel={opt.ariaLabel || opt.label}
          title={opt.title || opt.label}
          titlePosition={opt.titlePosition}
          variant="toggle"
          active={!!opt.checked}
          icon={opt.icon}
          disabled={opt.disabled}
          rounded={opt.rounded}
        />
      ))}
    </div>
  );
}
