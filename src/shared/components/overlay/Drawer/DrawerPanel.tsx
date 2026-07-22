import type { ReactNode } from "react";
import { useSwipeNavigation } from "@hooks";

interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number | string;
}

export function DrawerPanel({
  open,
  onClose,
  children,
  width = 256,
}: DrawerPanelProps) {
  const isRTL = document.documentElement.dir === "rtl";

  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    () => {},
    onClose,
    false,
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      <div
        className={`
          fixed top-0 h-full z-50 bg-surface shadow-lg
          overflow-hidden
          transition-transform duration-300
          ${
            open
              ? "translate-x-0"
              : isRTL
                ? "translate-x-full"
                : "-translate-x-full"
          }
          md:rounded-e-2xl
        `}
        style={{
          width,
          insetInlineStart: 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full w-full">{children}</div>
      </div>
    </>
  );
}
