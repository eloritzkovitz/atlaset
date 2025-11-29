import React from "react";

interface ToolbarIconProps {
  icon: React.ReactNode;
  count: number;
}

export function ToolbarIconWithCount({ icon, count }: ToolbarIconProps) {
  return (
    <span className="flex items-center gap-1">
      {icon}
      <span className="text-xs font-semibold">{count}</span>
    </span>
  );
}
