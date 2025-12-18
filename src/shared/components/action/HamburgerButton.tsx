import { FaBars } from "react-icons/fa6";

interface HamburgerButtonProps {
  onClick: () => void;
  className?: string;
}

export function HamburgerButton({
  onClick,
  className = "",
}: HamburgerButtonProps) {
  return (
    <button
      className={`p-2 absolute top-3 left-2 z-50 ${className}`}
      onClick={onClick}
      aria-label="Open menu"
      type="button"
    >
      <FaBars className="text-2xl" />
    </button>
  );
}
