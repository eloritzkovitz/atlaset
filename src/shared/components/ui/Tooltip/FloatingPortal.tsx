import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface FloatingPortalProps {
  children: ReactNode;
  anchorEl: HTMLElement | null;
  gap?: number;
  position?: "top" | "bottom" | "left" | "right";
  centerX?: boolean;
}

export function FloatingPortal({
  children,
  anchorEl,
  gap = 6,
  position = "top",
  centerX,
}: FloatingPortalProps) {
  const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });
  const portalRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!anchorEl || !portalRef.current) {
      setStyle({ display: "none" });
      return;
    }
    const anchorRect = anchorEl.getBoundingClientRect();
    const tooltipRect = portalRef.current.getBoundingClientRect();
    let top = 0,
      left = 0;
    const realGap = gap ?? 6;
    let transform = undefined;
    if (position === "top") {
      top = anchorRect.top - tooltipRect.height - realGap;
      if (centerX) {
        left = anchorRect.left + anchorRect.width / 2;
        transform = "translateX(-50%)";
      } else {
        left = anchorRect.left;
      }
    } else if (position === "bottom") {
      top = anchorRect.bottom + realGap;
      if (centerX) {
        left = anchorRect.left + anchorRect.width / 2;
        transform = "translateX(-50%)";
      } else {
        left = anchorRect.left;
      }
    } else if (position === "left") {
      top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
      left = anchorRect.left - tooltipRect.width - realGap;
    } else {
      // right
      top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
      left = anchorRect.right + realGap;
    }
    // Prevent horizontal clipping always
    const maxLeft = window.innerWidth - tooltipRect.width - 4;
    left = Math.max(4, Math.min(left, maxLeft));
    // Only prevent vertical clipping for non-top positions
    if (position !== "top") {
      const maxTop = window.innerHeight - tooltipRect.height - 4;
      top = Math.max(4, Math.min(top, maxTop));
    }
    setStyle({
      position: "fixed",
      top,
      left,
      zIndex: 10050,
      pointerEvents: "none",
      ...(transform ? { transform } : {}),
    });
  }, [anchorEl, gap, position]);

  if (!anchorEl) return null;
  return createPortal(
    <div ref={portalRef} style={style}>
      {children}
    </div>,
    document.body
  );
}
