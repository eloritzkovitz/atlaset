import React from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

/** A separator component. */
export function Separator({
  orientation = "horizontal",
  className = "",
  style,
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`
        bg-border shrink-0
        ${isHorizontal ? "h-px w-full" : "w-px"}
        ${className}
      `}
      style={style}
    />
  );
}
