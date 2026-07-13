import { Switch } from "@components";
import { SettingsRow } from "./SettingsRow";

interface SettingsToggleProps {
  label: string;
  description?: string;
  tooltip?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "surface" | "input";
}

export function SettingsToggle({
  label,
  description,
  tooltip,
  checked,
  onChange,
  variant = "surface",
}: SettingsToggleProps) {
  return (
    <SettingsRow
      label={label}
      description={description}
      tooltip={tooltip}
      control={
        <Switch variant={variant} checked={checked} onChange={onChange} />
      }
    />
  );
}
