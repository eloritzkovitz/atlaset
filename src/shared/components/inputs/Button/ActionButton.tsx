import React, { type ReactNode, useState } from "react";
import type { CommandId } from "@types";
import {
  InteractiveBase,
  type InteractiveBaseProps,
} from "../InteractiveBase/InteractiveBase";
import { Tooltip } from "../../overlay/Tooltip/Tooltip";

interface ActionButtonProps extends Omit<
  InteractiveBaseProps,
  "children" | "onClick"
> {
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "action" | "toggle" | "sort" | "custom";
  rounded?: boolean;
  title?: string;
  titlePosition?: "top" | "bottom" | "left" | "right";
  active?: boolean;
  shortcut?: CommandId | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      url,
      type = "button",
      icon,
      children,
      variant,
      rounded = false,
      className,
      style,
      ariaLabel = "Action",
      title,
      titlePosition = "bottom",
      active = true,
      disabled = false,
      shortcut = null,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    forwardedRef,
  ) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const base =
      "flex flex-row items-center justify-center gap-2 font-semibold border-none transition-colors ";
    const defaultStyle =
      "h-8 w-8 bg-transparent text-action-header hover:bg-action-header-hover text-lg ";
    const variants = {
      primary:
        "px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white focus:outline-none ",
      secondary:
        "px-4 py-2 rounded-lg bg-transparent hover:bg-secondary-hover focus:outline-none",
      action:
        "w-12 h-12 p-0 bg-action text-action-text text-lg hover:text-action-text-hover relative",
      toggle: `h-8 min-w-8 max-w-12 px-2 bg-transparent duration-200 ${active ? "" : "text-muted bg-transparent"}`,
      sort: "h-8 w-8 bg-input hover:bg-input-hover gap-2",
      custom: "",
    };

    const combinedClass = `${base} ${variant ? variants[variant] : defaultStyle} ${
      disabled && variant === "toggle"
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : ""
    } ${rounded ? "rounded-full" : ""} ${className || ""}`;

    return (
      <>
        <InteractiveBase
          ref={forwardedRef}
          url={url}
          type={type}
          disabled={disabled}
          className={combinedClass}
          ariaLabel={ariaLabel}
          style={style}
          onMouseEnter={(e) => {
            if (title && !disabled) setAnchorEl(e.currentTarget);
            onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            setAnchorEl(null);
            onMouseLeave?.(e);
          }}
          {...props}
        >
          {icon}
          {children}
        </InteractiveBase>

        {title && anchorEl && (
          <Tooltip
            content={title}
            position={titlePosition}
            shortcut={shortcut}
            target={anchorEl}
          />
        )}
      </>
    );
  },
);

ActionButton.displayName = "ActionButton";
