import React from "react";

interface SectionHeaderProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  children,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={
        "mt-4 mb-2 text-muted text-xs font-semibold uppercase tracking-wide select-none " +
        className
      }
    >
      {title ?? children}
    </div>
  );
}
