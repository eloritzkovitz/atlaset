import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ActionButton.css";
import React from "react";

interface ActionButtonProps {
  ref?: React.RefObject<HTMLElement | null>;
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
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
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
    },
    ref
  ) => {
    const defaultStyle = "action-btn";
    const buttonClass =
      className && className.trim().length > 0 ? className : defaultStyle;

    return (
      <button
        ref={ref}
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
);
