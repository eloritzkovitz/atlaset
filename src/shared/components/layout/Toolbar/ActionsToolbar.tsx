import type { ReactNode } from "react";

interface ActionsToolbarProps {
  children?: ReactNode;
  className?: string;
};

export function ActionsToolbar({
  children,
  className = "",
}: ActionsToolbarProps) {
  return <div className={`absolute flex flex-row items-center ${className}`}>{children}</div>;
}
