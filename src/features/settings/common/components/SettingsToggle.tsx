import { Switch } from "@components";
import { SettingsRow } from "./SettingsRow";

interface SettingsToggleProps {
  label: string;
  description?: string;
  tooltip?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "surface" | "input";
  disabled?: boolean;
}

export function SettingsToggle({
  label,
  description,
  tooltip,
  checked,
  onChange,
  variant = "surface",
  disabled = false,
}: SettingsToggleProps) {
  return (
    <SettingsRow
      label={label}
      description={description}
      tooltip={tooltip}
      control={
        <Switch
          variant={variant}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
    />
  );
}
