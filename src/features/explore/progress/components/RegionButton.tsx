interface RegionButtonProps {
  icon?: React.ReactNode;
  label: string;
  stats?: string;
  onClick: () => void;
  title?: string;
  className?: string;
  iconClassName?: string;
  indicatorClassName?: string;
  labelClassName?: string;
  statsClassName?: string;
}

const BUTTON_CLASSES =
  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start " +
  "cursor-pointer transition-colors duration-150 hover:bg-primary/20 " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-primary focus-visible:ring-offset-2";

export function RegionButton({
  icon,
  label,
  stats,
  onClick,
  title,
  className = "",
  iconClassName = "",
  indicatorClassName,
  labelClassName = "",
  statsClassName = "",
}: RegionButtonProps) {
  return (
    <button
      type="button"
      className={`${BUTTON_CLASSES} ${className}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {indicatorClassName && (
        <span
          aria-hidden="true"
          className={`size-2 shrink-0 rounded-full ${indicatorClassName}`}
        />
      )}
      {icon && (
        <span className={`shrink-0 ${iconClassName}`} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={`min-w-0 truncate font-semibold ${labelClassName}`}>
        {label}
      </span>
      {stats && (
        <span
          className={`ms-auto shrink-0 text-sm font-medium ${statsClassName}`}
        >
          {stats}
        </span>
      )}
    </button>
  );
}
