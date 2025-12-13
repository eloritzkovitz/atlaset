import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

interface ArrowButtonProps {
  onClick: () => void;
  direction: "up" | "down";
  ariaLabel: string;
}

export function ArrowButton({
  onClick,
  direction,
  ariaLabel,
}: ArrowButtonProps) {
  const Icon = direction === "up" ? FaChevronUp : FaChevronDown;
  return (
    <button
      type="button"
      tabIndex={-1}
      className="p-0.5 rounded"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Icon className="w-3 h-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
    </button>
  );
}
