import {
  type ReactNode,
  useState,
  useRef,
  useLayoutEffect,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import type { CommandId, Point } from "@types";
import { formatShortcut } from "@utils/string";

export interface TooltipProps {
  content: ReactNode;
  children?: ReactNode;
  position?: "cursor" | "top" | "bottom" | "left" | "right";
  className?: string;
  overrideCoords?: Point | null;
  shortcut?: CommandId | null;
  target?: HTMLElement | SVGElement | null;
}

type ReactEventHandler<E> = (e: E) => void;

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
  overrideCoords = null,
  shortcut = null,
  target = null,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [coords, setCoords] = useState<Point>({ x: 0, y: 0 });

  const timeoutRef = useRef<number | null>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const activeAnchor = target || anchorRef.current;

  const show = (e?: React.MouseEvent) => {
    if (e && position === "cursor") setCoords({ x: e.clientX, y: e.clientY });
    timeoutRef.current = window.setTimeout(() => setVisible(true), 100);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
    setStyle({});
  };

  // Update tooltip position when overrideCoords changes
  useLayoutEffect(() => {
    if (overrideCoords) setCoords(overrideCoords);
  }, [overrideCoords]);

  // Update tooltip position when visible, position, coords, or overrideCoords change
  useLayoutEffect(() => {
    const isCurrentlyVisible = !!overrideCoords || !!target || visible;
    if (!isCurrentlyVisible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 6;
    let top = 0,
      left = 0;

    const activeCoords =
      overrideCoords || (position === "cursor" ? coords : null);

    if (activeCoords) {
      top = activeCoords.y + 12;
      left = activeCoords.x + 12;
    } else if (activeAnchor) {
      const anchor = activeAnchor.getBoundingClientRect();
      top =
        position === "top"
          ? anchor.top - tooltip.height - gap
          : position === "bottom"
            ? anchor.bottom + gap
            : anchor.top + anchor.height / 2 - tooltip.height / 2;
      left =
        position === "left"
          ? anchor.left - tooltip.width - gap
          : position === "right"
            ? anchor.right + gap
            : anchor.left + anchor.width / 2 - tooltip.width / 2;
    }

    setStyle({
      position: "fixed",
      top: Math.max(4, Math.min(top, window.innerHeight - tooltip.height - 4)),
      left: Math.max(4, Math.min(left, window.innerWidth - tooltip.width - 4)),
      zIndex: 10050,
      pointerEvents: "none",
    });
  }, [visible, position, coords, overrideCoords, target, activeAnchor]);

  const getHandlers = (childProps: Record<string, unknown> = {}) => {
    const asReactHandler = <E,>(handler: unknown) =>
      handler as ReactEventHandler<E> | undefined;

    return {
      onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
        show(e);
        asReactHandler<React.MouseEvent<HTMLElement>>(
          childProps.onMouseEnter,
        )?.(e);
      },
      onMouseMove: (e: React.MouseEvent<HTMLElement>) => {
        if (position === "cursor") setCoords({ x: e.clientX, y: e.clientY });
        asReactHandler<React.MouseEvent<HTMLElement>>(childProps.onMouseMove)?.(
          e,
        );
      },
      onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
        hide();
        asReactHandler<React.MouseEvent<HTMLElement>>(
          childProps.onMouseLeave,
        )?.(e);
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        if (position === "cursor" && anchorRef.current) {
          const r = anchorRef.current.getBoundingClientRect();
          setCoords({ x: r.left + r.width / 2, y: r.bottom });
        }
        show();
        asReactHandler<React.FocusEvent<HTMLElement>>(childProps.onFocus)?.(e);
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        hide();
        asReactHandler<React.FocusEvent<HTMLElement>>(childProps.onBlur)?.(e);
      },
      tabIndex:
        typeof childProps.tabIndex === "number" ? childProps.tabIndex : 0,
    };
  };

  // Render the tooltip content in a portal to avoid clipping issues and ensure it appears above other elements
  const renderPortalContent = () =>
    createPortal(
      <span
        ref={tooltipRef}
        style={{ ...style, whiteSpace: "pre-line" }}
        className={`inline-flex items-center min-w-max px-2 py-1 rounded-lg bg-black border border-muted/15 text-white text-sm group dynamic-tooltip ${className}`}
        role="tooltip"
      >
        <span>{content}</span>

        {shortcut && (
          <span className="text-muted select-none tracking-wide ms-2">
            {formatShortcut(shortcut)}
          </span>
        )}

        {(!overrideCoords || target) && position !== "cursor" && (
          <div
            className={`absolute border-[4px] border-transparent pointer-events-none
            ${position === "top" ? "top-full left-1/2 -translate-x-1/2 border-t-black" : ""}
            ${position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 border-b-black" : ""}
            ${position === "left" ? "left-full top-1/2 -translate-y-1/2 border-l-black" : ""}
            ${position === "right" ? "right-full top-1/2 -translate-y-1/2 border-r-black" : ""}
          `}
          />
        )}
      </span>,
      document.body,
    );

  // If there are no children, only render the tooltip if overrideCoords is provided
  if (!children) return overrideCoords || target ? renderPortalContent() : null;

  const c = children as React.ReactElement;
  const isCloneable =
    isValidElement(c) &&
    (typeof c.type === "string" ||
      (typeof c.type === "object" && c.type !== null && "$$typeof" in c.type));
  const rawProps =
    isCloneable && c.props && typeof c.props === "object"
      ? (c.props as Record<string, unknown>)
      : {};

  const trigger = isCloneable ? (
    cloneElement(c, {
      ...getHandlers(rawProps),
      ref: anchorRef,
    } as React.HTMLAttributes<HTMLElement> & {
      ref: React.RefObject<HTMLElement | null>;
    })
  ) : (
    <span className="relative inline-block" ref={anchorRef} {...getHandlers()}>
      {children}
    </span>
  );

  return (
    <>
      {trigger}
      {visible && renderPortalContent()}
    </>
  );
}
