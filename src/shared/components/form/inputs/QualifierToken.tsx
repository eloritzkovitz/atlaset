interface QualifierTokenProps {
  label: string;
  lockedSuffix?: string;
  onClear?: () => void;
  clearable?: boolean;
}

export function QualifierToken({
  label,
  lockedSuffix,
  onClear,
  clearable = true,
}: QualifierTokenProps) {
  const baseClasses =
    "inline-flex items-center px-3 py-2 rounded-l-full bg-input/50 border-2 border-surface-hover text-sm ";
  const interactiveClasses =
    "text-muted cursor-pointer hover:bg-input-hover/50 focus:outline-none focus:ring-2 focus:ring-ring-focus";
  const nonInteractiveClasses = "text-muted cursor-default opacity-80";
  const className = `${baseClasses} ${clearable ? interactiveClasses : nonInteractiveClasses}`;
  const ariaRole = clearable ? "button" : "img";

  // Handle key presses for accessibility when clearable
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!clearable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClear?.();
    }
  };

  // Only trigger clear on click if clearable, otherwise do nothing
  const handleClick = () => {
    if (!clearable) return;
    onClear?.();
  };

  return (
    <div
      role={ariaRole}
      tabIndex={clearable ? 0 : -1}
      aria-label={`Qualifier ${label}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={className}
    >
      {label}
      {lockedSuffix ? <span className="ml-1">{lockedSuffix}</span> : null}
    </div>
  );
}
