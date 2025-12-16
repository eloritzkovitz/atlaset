import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

interface ArrowButtonProps {
  onClick: () => void;
  direction: "up" | "down";
  ariaLabel: string;
  disabled?: boolean;
}

export function ArrowButton({
  onClick,
  direction,
  ariaLabel,
  disabled = false,
}: ArrowButtonProps) {
  const Icon = direction === "up" ? FaChevronUp : FaChevronDown;
  return (
    <button
      type="button"
      tabIndex={-1}
      className="p-0.5 rounded"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <Icon className="w-3 h-3 text-muted hover:text-muted-hover" />
    </button>
  );
}
