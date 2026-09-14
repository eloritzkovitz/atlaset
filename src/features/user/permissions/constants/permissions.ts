import type { DropdownOption } from "@types";
import type { Permission } from "../types";

export const PERMISSION_OPTIONS: DropdownOption<Permission>[] = [
  {
    value: "viewer",
    label: "Viewer",
  },
  {
    value: "editor",
    label: "Editor",
  },
];
