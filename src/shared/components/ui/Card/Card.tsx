import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  loading?: boolean;
  skeletonLines?: number;
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
}

export function Card({
  className = "",
  children,
  loading = false,
  skeletonLines = 3,
  onClick,
  title,
  ariaLabel,
}: CardProps) {
  const clickable = !!onClick;
  const baseClass =
    `bg-surface dark:bg-surface-alt rounded-2xl shadow p-5 ` +
    (clickable ? "cursor-pointer transition hover:shadow-lg " : "") +
    className;

  if (loading) {
    return (
      <div
        className={baseClass}
        title={title}
        aria-label={ariaLabel}
        tabIndex={clickable ? 0 : undefined}
        onClick={onClick}
        role={clickable ? "button" : undefined}
      >
        {Array.from({ length: skeletonLines }).map((_, idx) => (
          <div
            key={idx}
            className={`h-5 w-${
              idx === 0 ? "3/4" : "full"
            } bg-input rounded-full mb-3`}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={baseClass}
      title={title}
      aria-label={ariaLabel}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      role={clickable ? "button" : undefined}
    >
      {children}
    </div>
  );
}
