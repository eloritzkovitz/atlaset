import type { Option } from "@types";
import type { Permission } from "../types";

export const PERMISSION_OPTIONS: Option<Permission>[] = [
  {
    value: "viewer",
    label: "Viewer",
  },
  {
    value: "editor",
    label: "Editor",
  },
];
