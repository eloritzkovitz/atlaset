import {
  type ReactNode,
  useState,
  useRef,
  useLayoutEffect,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const timeoutRef = useRef<number | null>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), 100);
  };
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
    setTooltipStyle({});
  };

  // Calculate tooltip position for portal
  useLayoutEffect(() => {
    if (!visible || !anchorRef.current || !tooltipRef.current) return;
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    let top = 0,
      left = 0;
    const gap = 6;
    if (position === "top") {
      top = anchorRect.top - tooltipRect.height - gap;
      left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
    } else if (position === "bottom") {
      top = anchorRect.bottom + gap;
      left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
    } else if (position === "left") {
      top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
      left = anchorRect.left - tooltipRect.width - gap;
    } else {
      // right
      top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
      left = anchorRect.right + gap;
    }
    // Prevent horizontal clipping always
    const maxLeft = window.innerWidth - tooltipRect.width - 4;
    left = Math.max(4, Math.min(left, maxLeft));
    // Only prevent vertical clipping for non-top positions
    if (position !== "top") {
      const maxTop = window.innerHeight - tooltipRect.height - 4;
      top = Math.max(4, Math.min(top, maxTop));
    }
    setTooltipStyle({
      position: "fixed",
      top,
      left,
      zIndex: 10050,
      pointerEvents: "none",
    });
  }, [visible, position]);

  // If child is a valid element, clone and attach ref and handlers
  let trigger: React.ReactNode;
  if (isValidElement(children)) {
    const childProps = (children as React.ReactElement).props as Record<string, unknown>;
    const isDOM = typeof (children as React.ReactElement).type === "string";
    // Try to detect if custom component supports ref (forwardRef)
    const type = (children as React.ReactElement).type as unknown;
    const supportsRef = isDOM || (typeof type === "object" && type !== null && "$$typeof" in type && String((type as { $$typeof?: unknown }).$$typeof).includes("Symbol(react.forward_ref)"));
    if (supportsRef) {
      const props: Record<string, unknown> = {
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
          show();
          if (childProps.onMouseEnter) (childProps.onMouseEnter as (e: React.MouseEvent<HTMLElement>) => void)(e);
        },
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
          hide();
          if (childProps.onMouseLeave) (childProps.onMouseLeave as (e: React.MouseEvent<HTMLElement>) => void)(e);
        },
        onFocus: (e: React.FocusEvent<HTMLElement>) => {
          show();
          if (childProps.onFocus) (childProps.onFocus as (e: React.FocusEvent<HTMLElement>) => void)(e);
        },
        onBlur: (e: React.FocusEvent<HTMLElement>) => {
          hide();
          if (childProps.onBlur) (childProps.onBlur as (e: React.FocusEvent<HTMLElement>) => void)(e);
        },
        tabIndex: childProps.tabIndex ?? 0,
        ref: anchorRef,
      };
      trigger = cloneElement(children as React.ReactElement, props);
    } else {
      trigger = (
        <span
          className="relative inline-block"
          ref={anchorRef}
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
          tabIndex={0}
        >
          {children}
        </span>
      );
    }
  } else {
    // fallback to span wrapper
    trigger = (
      <span
        className="relative inline-block"
        ref={anchorRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
      >
        {children}
      </span>
    );
  }

  return (
    <>
      {trigger}
      {visible &&
        createPortal(
          <span
            ref={tooltipRef}
            style={tooltipStyle}
            className="whitespace-nowrap px-2 py-1 rounded-lg bg-black text-white text-sm shadow-lg transition-opacity duration-150 opacity-90"
            role="tooltip"
          >
            {content}
          </span>,
          document.body
        )}
    </>
  );
}
