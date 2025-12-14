import React, { useLayoutEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ActionButton } from "./ActionButton";

interface FloatingChevronButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
  position: "left" | "right";
  chevronDirection: "left" | "right";
  offset?: number;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onClick: () => void;
  ariaLabel?: string;
  title?: string;
  className?: string;
  positionKey?: string;
}

export const FloatingChevronButton = React.forwardRef<
  HTMLButtonElement,
  FloatingChevronButtonProps
>(
  (
    {
      targetRef,
      position,
      chevronDirection,
      offset = 0,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ariaLabel,
      title,
      className = "",
      positionKey,
    },
    ref
  ) => {
    const [style, setStyle] = useState<React.CSSProperties>({});

    const BUTTON_SIZE = 48;

    // Update button position based on targetRef
    useLayoutEffect(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setStyle({
          position: "fixed",
          top: rect.top + rect.height / 2 - BUTTON_SIZE / 2,
          left:
            position === "right"
              ? rect.right - BUTTON_SIZE / 2 + offset
              : rect.left - BUTTON_SIZE / 2 - offset,
          zIndex: 10600,
        });
      }
    }, [targetRef, position, offset, positionKey]);

    return (
      <ActionButton
        ref={ref}
        style={style}
        className={`z-[10000] transition-colors ${className}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        ariaLabel={ariaLabel}
        title={title}
        icon={
          chevronDirection === "right" ? <FaChevronRight /> : <FaChevronLeft />
        }
        variant="action"
        rounded
      />
    );
  }
);
