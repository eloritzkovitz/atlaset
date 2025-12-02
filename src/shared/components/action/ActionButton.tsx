import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ActionButton.css";

interface ActionButtonProps {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];  
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
  className?: string;
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
};

export function ActionButton({
  type = "button", 
  onMouseEnter,
  onMouseLeave,
  onClick,
  ariaLabel = "Action",
  title = "Action",
  className,
  icon,
  children,  
  disabled = false,
  style,
}: ActionButtonProps) {
  const defaultStyle = "action-btn";
  const buttonClass =
    className && className.trim().length > 0 ? className : defaultStyle;

  return (
    <button
      type={type}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`flex flex-row items-center justify-center gap-2 ${buttonClass}`}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      style={style}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
}
