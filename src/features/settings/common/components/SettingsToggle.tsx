import { Switch } from "@components";
import { SettingsRow } from "./SettingsRow";

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: SettingsToggleProps) {
  return (
    <SettingsRow
      label={label}
      description={description}
      control={<Switch checked={checked} onChange={onChange} />}
    />
  );
}
