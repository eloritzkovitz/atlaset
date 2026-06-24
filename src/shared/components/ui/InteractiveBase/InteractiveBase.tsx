import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { isExternalUrl } from "@utils/url";

export interface InteractiveBaseProps {
  url?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
  children: ReactNode;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>,
  ) => void;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  onTouchStart?: React.TouchEventHandler<HTMLElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLElement>;
  onPointerDown?: React.PointerEventHandler<HTMLElement>;
}

/** A reusable base component for interactive elements. */
export const InteractiveBase = React.forwardRef<
  HTMLElement,
  InteractiveBaseProps
>(
  (
    {
      url,
      type = "button",
      disabled,
      className,
      ariaLabel,
      style,
      children,
      ...eventHandlers
    },
    ref,
  ) => {
    const isExternal = isExternalUrl(url);

    // Shared structural attributes across standard wrappers
    const attributes = {
      className,
      "aria-label": ariaLabel,
      style,
      ...eventHandlers,
      children,
    };

    if (url) {
      const linkStyle = disabled
        ? { pointerEvents: "none" as const, opacity: 0.5, ...style }
        : style;
      const tabIndex = disabled ? -1 : 0;

      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            {...attributes}
            style={linkStyle}
          />
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={url}
          tabIndex={tabIndex}
          {...attributes}
          style={linkStyle}
        />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        {...attributes}
      />
    );
  },
);
