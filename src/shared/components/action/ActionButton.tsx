import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps {
  ref?: React.RefObject<HTMLElement | null>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "action" | "toggle";
  rounded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  title?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onTouchStart?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      type = "button",
      icon,
      children,
      variant,
      rounded = false,
      className,
      style,
      ariaLabel = "Action",
      title = "Action",
      active = true,
      disabled = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
    },
    ref
  ) => {
    const base = "flex flex-row items-center justify-center gap-2 ";
    const defaultStyle =
      "h-8 w-8 bg-transparent text-action-header border-none hover:bg-action-header-hover text-lg transition-colors gap-2";
    const variants = {
      primary: "",
      secondary: "",
      action:
        "w-12 h-12 p-0 bg-action text-action-text text-lg hover:text-action-text-hover relative transition",
      toggle: "h-8 min-w-8 max-w-12 px-2 bg-transparent border-none transition-colors duration-200",
    };
    const buttonClass =
      className && className.trim().length > 0 ? className : defaultStyle;

    return (
      <button
        ref={ref}
        type={type}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
        className={`${base} ${variant ? variants[variant] : buttonClass} ${
          active ? "text-blue-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600" : "text-gray-400 bg-transparent"
        } ${rounded ? "rounded-full" : ""}`}
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
