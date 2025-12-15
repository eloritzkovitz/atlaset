interface TimelineDotProps {
  selected: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function TimelineDot({
  selected,
  onClick,
  ariaLabel,
}: TimelineDotProps) {
  return (
    <button
      className={`
     rounded-full
    ${selected ? "w-3 h-3 bg-primary" : "w-2 h-2 mt-0.5 bg-muted"}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus
    transition
  `}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      style={{ zIndex: 1 }}
    />
  );
}
