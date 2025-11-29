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
    ${selected ? "w-3 h-3 bg-blue-500" : "w-2 h-2 mt-0.5 bg-gray-300"}
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    transition
  `}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
      style={{ zIndex: 1 }}
    />
  );
}
