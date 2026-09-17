import { useTranslation } from "react-i18next";
import { DropdownSelectInput } from "@components";
import { PERMISSION_OPTIONS } from "../constants/permissions";
import type { Permission } from "../types";

interface UserPermissionSelectProps {
  permission: Permission;
  onChange: (permission: Permission) => void;
  disabled?: boolean;
}

export function UserPermissionSelect({
  permission,
  onChange,
  disabled = false,
}: UserPermissionSelectProps) {
  const { t } = useTranslation("user");

  const options = PERMISSION_OPTIONS.map((option) => ({
    ...option,
    label: t(`permissions.${option.value}`),
  }));

  return (
    <DropdownSelectInput<Permission>
      value={permission}
      options={options}
      onChange={(value) => {
        if (!Array.isArray(value)) {
          onChange(value);
        }
      }}
      disabled={disabled}
    />
  );
}
