import React from "react";

export function Separator({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`border-b border-gray-200 dark:border-gray-600 ${className}`}
      style={style}
    />
  );
}