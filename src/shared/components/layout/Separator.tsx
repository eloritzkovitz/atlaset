import React from "react";

/** A separator component. */
export function Separator({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`border-b border-border ${className}`} style={style} />
  );
}
