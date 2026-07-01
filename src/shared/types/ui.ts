import type { ReactNode } from "react";

/** Represents the view mode for displaying content. */
export type ViewMode = "grid" | "list";

/** Represents an option in the toolbar toggle. */
export type ToolbarToggleOption = {
  value: string;
  icon: ReactNode;
  label: string;
  ariaLabel?: string;
  title?: string;
  titlePosition?: "top";
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
};
