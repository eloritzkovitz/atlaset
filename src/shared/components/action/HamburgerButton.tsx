import { FaBars } from "react-icons/fa6";

interface HamburgerButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
}

/** Displays a hamburger or custom icon button for opening a menu.
 * @param onClick - Function to call when the button is clicked
 * @param className - Optional additional CSS classes for styling
 * @param icon - Optional icon (component or element) to display instead of the default hamburger icon
 */
export function HamburgerButton({
  onClick,
  className = "",
  icon,
}: HamburgerButtonProps) {
  return (
    <button
      className={`p-2 absolute top-3 left-2 z-50 ${className}`}
      onClick={onClick}
      aria-label="Open menu"
      type="button"
    >
      {icon ? icon : <FaBars className="text-2xl" />}
    </button>
  );
}
