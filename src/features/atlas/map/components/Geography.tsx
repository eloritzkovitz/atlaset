import React, { useState, forwardRef, useMemo } from "react";
import type { SVGProps } from "react";
import type { GeographyFeature } from "../types";

export interface GeographyProps
  extends Omit<SVGProps<SVGPathElement>, "style"> {
  geography: GeographyFeature;
  style?: {
    default?: React.CSSProperties;
    hover?: React.CSSProperties;
    pressed?: React.CSSProperties;
  };
  className?: string;
  onMouseEnter?: (evt: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave?: (evt: React.MouseEvent<SVGPathElement>) => void;
  onMouseDown?: (evt: React.MouseEvent<SVGPathElement>) => void;
  onMouseUp?: (evt: React.MouseEvent<SVGPathElement>) => void;
  onFocus?: (evt: React.FocusEvent<SVGPathElement>) => void;
  onBlur?: (evt: React.FocusEvent<SVGPathElement>) => void;
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

    const eventHandlers = useMemo(
      () => ({
        handleMouseEnter: (evt: React.MouseEvent<SVGPathElement>) => {
          setFocus(true);
          if (onMouseEnter) onMouseEnter(evt);
        },
        handleMouseLeave: (evt: React.MouseEvent<SVGPathElement>) => {
          setFocus(false);
          if (isPressed) setPressed(false);
          if (onMouseLeave) onMouseLeave(evt);
        },
        handleFocus: (evt: React.FocusEvent<SVGPathElement>) => {
          setFocus(true);
          if (onFocus) onFocus(evt);
        },
        handleBlur: (evt: React.FocusEvent<SVGPathElement>) => {
          setFocus(false);
          if (isPressed) setPressed(false);
          if (onBlur) onBlur(evt);
        },
        handleMouseDown: (evt: React.MouseEvent<SVGPathElement>) => {
          setPressed(true);
          if (onMouseDown) onMouseDown(evt);
        },
        handleMouseUp: (evt: React.MouseEvent<SVGPathElement>) => {
          setPressed(false);
          if (onMouseUp) onMouseUp(evt);
        },
      }),
      [
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
        onFocus,
        onBlur,
        isPressed,
      ]
    );

    const computedStyle = useMemo(() => {
      return style[
        isPressed || isFocused ? (isPressed ? "pressed" : "hover") : "default"
      ];
    }, [style, isPressed, isFocused]);

    return (
      <path
        ref={ref}
        tabIndex={0}
        className={`rsm-geography ${className}`}
        d={geography.svgPath}
        onMouseEnter={eventHandlers.handleMouseEnter}
        onMouseLeave={eventHandlers.handleMouseLeave}
        onFocus={eventHandlers.handleFocus}
        onBlur={eventHandlers.handleBlur}
        onMouseDown={eventHandlers.handleMouseDown}
        onMouseUp={eventHandlers.handleMouseUp}
        style={computedStyle}
        {...restProps}
      />
    );
  }
);

Geography.displayName = "Geography";
