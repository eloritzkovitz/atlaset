import type { ReactNode } from "react";

// Toolbar toggle option type definition
export type ToolbarToggleOption = {
  value: string;
  icon: ReactNode;
  label: string;
  ariaLabel?: string;
  title?: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}