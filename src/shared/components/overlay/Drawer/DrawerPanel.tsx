import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSwipeNavigation } from "@hooks";
import { Backdrop } from "../Backdrop/Backdrop";
import { OverlayPortal } from "../OverlayPortal/OverlayPortal";

interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
  position?: "start" | "end";
}

export function DrawerPanel({
  open,
  onClose,
  children,
  width = 256,
  position = "end",
}: DrawerPanelProps) {
  const isRTL = document.documentElement.dir === "rtl";
  const opensFromStart = position === "start";
  const [isVisible, setIsVisible] = useState(false);

  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    () => {},
    onClose,
    false,
  );

  // Handle visibility state for animation
  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }

    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <OverlayPortal>
      {open && <Backdrop className="z-[10009]" onClick={onClose} />}

      <div
        className={`
          fixed top-0 h-full z-[10010] bg-surface shadow-lg
          overflow-hidden
          transition-transform duration-200
          ${
            isVisible
              ? "translate-x-0"
              : opensFromStart
                ? isRTL
                  ? "translate-x-full"
                  : "-translate-x-full"
                : isRTL
                  ? "-translate-x-full"
                  : "translate-x-full"
          }
          ${opensFromStart ? "md:rounded-e-2xl" : "md:rounded-s-2xl"}
        `}
        style={{
          width,
          ...(opensFromStart
            ? { insetInlineStart: 0 }
            : { insetInlineEnd: 0 }),
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full w-full">{children}</div>
      </div>
    </OverlayPortal>
  );
}
