import type { ReactNode } from "react";
import { Separator } from "../Separator";

interface PanelHeaderProps {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  showSeparator?: boolean;
};

export function PanelHeader({
  title,
  children,
  className,
  showSeparator,
}: PanelHeaderProps) {
  return (
    <div>
      <div className={`px-4 pt-4 pb-0 flex flex-shrink-0 items-center justify-between mb-4 select-none ${className ?? ""}`}>
        <div className="flex items-center gap-2 h-8 text-lg font-bold">{title}</div>
        <div className="flex gap-2">{children}</div>
      </div>
      {showSeparator && <Separator className="mt-4 my-4" />}
    </div>
  );
}
