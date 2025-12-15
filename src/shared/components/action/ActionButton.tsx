import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps {
  ref?: React.RefObject<HTMLElement | null>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "action" | "toggle" | "sort" | "custom";
  rounded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  title?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
    const base =
      "flex flex-row items-center justify-center gap-2 font-semibold border-none transition-colors ";
    const defaultStyle =
      "h-8 w-8 bg-transparent text-action-header hover:bg-action-header-hover text-lg ";
    const variants = {
      primary:
        "px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover focus:outline-none",
      secondary:
        "px-4 py-2 rounded-lg bg-transparent hover:bg-secondary focus:outline-none",
      action:
        "w-12 h-12 p-0 bg-action text-action-text text-lg hover:text-action-text-hover relative",
      toggle: "h-8 min-w-8 max-w-12 px-2 bg-transparent duration-200",
      sort: "h-10 w-10 bg-input hover:bg-input-hover gap-2",
      custom: "",
    };
    const buttonClass = variant ? variants[variant] : defaultStyle;

    // Only apply 'active' styling for toggle variant
    let stateClass = "";
    if (variant === "toggle") {
      stateClass = active ? "" : "text-muted bg-transparent";
    }
    const disabledStyles = disabled && variant === "toggle"
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "";

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
        className={`${base} ${buttonClass} ${stateClass} ${disabledStyles} ${
          rounded ? "rounded-full" : ""
        } ${className || ""}`}
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
