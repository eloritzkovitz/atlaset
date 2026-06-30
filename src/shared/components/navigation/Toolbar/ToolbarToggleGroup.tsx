import type { ToolbarToggleOption } from "@types";
import { ActionButton } from "../../inputs/Button/ActionButton";

export function ToolbarToggleGroup({
  options,
}: {
  options: ToolbarToggleOption[];
}) {
  return (
    <div className="flex items-center">
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
        />
      ))}
    </div>
  );
}
