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
  return (
    <DropdownSelectInput<Permission>
      value={permission}
      options={PERMISSION_OPTIONS}
      onChange={(value) => {
        if (!Array.isArray(value)) {
          onChange(value);
        }
      }}
      disabled={disabled}
    />
  );
}
