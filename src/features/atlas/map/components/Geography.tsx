import React, { useState, forwardRef, useMemo } from "react";
import type { SVGProps } from "react";
import type { GeographyFeature } from "../types";

export interface GeographyProps extends Omit<
  SVGProps<SVGPathElement>,
  "style"
> {
  geography: GeographyFeature;
  style?: {
    default?: React.CSSProperties;
    hover?: React.CSSProperties;
    pressed?: React.CSSProperties;
  };
  className?: string;
}

export const Geography = forwardRef<SVGPathElement, GeographyProps>(
  (props, ref) => {
    const {
      geography,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onFocus,
      onBlur,
      style = {},
      className = "",
      ...restProps
    } = props;
    const [isPressed, setPressed] = useState(false);
    const [isFocused, setFocus] = useState(false);

    // Compute the style based on the current state (default, hover, pressed)
    const computedStyle = useMemo(() => {
      if (isPressed) return style.pressed || style.hover || style.default;
      if (isFocused) return style.hover || style.default;
      return style.default;
    }, [style, isPressed, isFocused]);

    // Event Handlers for mouse and focus events
    const handleMouseEnter = (evt: React.MouseEvent<SVGPathElement>) => {
      setFocus(true);
      if (onMouseEnter) onMouseEnter(evt);
    };

    const handleMouseLeave = (evt: React.MouseEvent<SVGPathElement>) => {
      setFocus(false);
      setPressed(false);
      if (onMouseLeave) onMouseLeave(evt);
    };

    const handleFocus = (evt: React.FocusEvent<SVGPathElement>) => {
      setFocus(true);
      if (onFocus) onFocus(evt);
    };

    const handleBlur = (evt: React.FocusEvent<SVGPathElement>) => {
      setFocus(false);
      setPressed(false);
      if (onBlur) onBlur(evt);
    };

    const handleMouseDown = (evt: React.MouseEvent<SVGPathElement>) => {
      if (evt.button === 0) {
        setPressed(true);
      }
      if (onMouseDown) onMouseDown(evt);
    };

    const handleMouseUp = (evt: React.MouseEvent<SVGPathElement>) => {
      setPressed(false);
      if (onMouseUp) onMouseUp(evt);
    };

    return (
      <path
        ref={ref}
        tabIndex={0}
        className={`rsm-geography outline-none transition-colors duration-150 ${className}`}
        d={geography.svgPath}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={computedStyle}
        {...restProps}
      />
    );
  },
);

Geography.displayName = "Geography";
