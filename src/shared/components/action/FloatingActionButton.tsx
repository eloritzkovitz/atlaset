import type { ReactNode, ButtonHTMLAttributes } from "react";

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: ReactNode;
  ariaLabel?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export function FloatingActionButton({
  onClick,
  icon,
  ariaLabel = "Action",
  title = "Action",
  className = "",
  disabled = false,
  type = "button",
}: FloatingActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      className={`fixed bg-blue-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center hover:bg-blue-700 transition ${className}`}
      style={{ aspectRatio: "1 / 1" }}
    >
      <span className="text-2xl flex items-center justify-center">{icon}</span>
    </button>
  );
}
