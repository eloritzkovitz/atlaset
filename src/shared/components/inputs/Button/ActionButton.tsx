import React, { type ReactNode } from "react";
import { useLanguage } from "@features/settings";
import {
  InteractiveBase,
  type InteractiveBaseProps,
} from "../InteractiveBase/InteractiveBase";
import { Tooltip } from "../../overlay/Tooltip/Tooltip";
import type { KeyCommand } from "@types";

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
  shortcut?: KeyCommand | null;
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
      ...props
    },
    ref,
  ) => {
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
      toggle: "h-8 min-w-8 max-w-12 px-2 bg-transparent duration-200",
      sort: "h-8 w-8 bg-input hover:bg-input-hover gap-2",
      custom: "",
    };

    const buttonClass = variant ? variants[variant] : defaultStyle;

    let stateClass = "";
    if (variant === "toggle") {
      stateClass = active ? "" : "text-muted bg-transparent";
    }

    const disabledStyles =
      disabled && variant === "toggle"
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "";

    const { isRtl } = useLanguage();
    const iconNode = icon ? <span className="inline-flex">{icon}</span> : null;

    const innerContent =
      icon && children ? (
        isRtl ? (
          <>
            {children}
            {iconNode}
          </>
        ) : (
          <>
            {iconNode}
            {children}
          </>
        )
      ) : (
        <>
          {iconNode}
          {children}
        </>
      );

    const combinedClass = `${base} ${buttonClass} ${stateClass} ${disabledStyles} ${
      rounded ? "rounded-full" : ""
    } ${className || ""}`;

    const buttonElement = (
      <InteractiveBase
        ref={ref}
        url={url}
        type={type}
        disabled={disabled}
        className={combinedClass}
        ariaLabel={ariaLabel}
        style={style}
        {...props}
      >
        {innerContent}
      </InteractiveBase>
    );

    return title ? (
      <Tooltip content={title} position={titlePosition} shortcut={shortcut}>
        {buttonElement}
      </Tooltip>
    ) : (
      buttonElement
    );
  },
);

ActionButton.displayName = "ActionButton";
