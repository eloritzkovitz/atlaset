import React from "react";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  animationClass?: string;
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  icon?: React.ElementType;
  iconClass?: string;
  loading?: boolean;
  skeletonLines?: number;
  onClick?: () => void;
}

export function Card({
  className = "",
  children,
  animationClass = "",
  title,
  subtitle,
  ariaLabel,
  icon: Icon,
  iconClass = "",
  loading = false,
  skeletonLines = 3,
  onClick,
}: CardProps) {
  const isInteractive = !!onClick && !loading;

  const baseClass = [
    "bg-surface dark:bg-surface-alt rounded-2xl shadow-sm p-5 text-start w-full block",
    isInteractive
      ? "cursor-pointer transition hover:shadow-lg select-none"
      : "",
    loading ? "animate-pulse" : "",
    animationClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    className: baseClass,
    "aria-label": ariaLabel ?? (loading && title ? `Loading ${title}` : title),
  };

  const Component = isInteractive ? "button" : "div";
  const interactiveProps = isInteractive
    ? { onClick, type: "button" as const }
    : {};

  if (loading) {
    return (
      <div {...sharedProps}>
        {(title || Icon) && (
          <div className="flex items-center gap-3 mb-4">
            {Icon && <div className="w-8 h-8 bg-input rounded-full shrink-0" />}
            <div className="w-full">
              <div className="h-5 w-32 bg-input rounded mb-2" />
              {subtitle && <div className="h-3 w-20 bg-input rounded" />}
            </div>
          </div>
        )}

        {Array.from({ length: skeletonLines }).map((_, idx) => (
          <div
            key={idx}
            className={`h-5 bg-input rounded-full mb-3 ${
              idx === 0
                ? "w-3/4"
                : idx === skeletonLines - 1
                  ? "w-1/2"
                  : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <Component {...sharedProps} {...interactiveProps}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-3">
          {Icon && <Icon className={`text-2xl shrink-0 ${iconClass}`} />}
          <div>
            {title && (
              <div className="font-semibold text-lg leading-tight text-foreground">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-xs text-muted mt-0.5">{subtitle}</div>
            )}
          </div>
        </div>
      )}

      {children}
    </Component>
  );
}
