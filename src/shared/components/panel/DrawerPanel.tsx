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
  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    () => {},
    onClose,
    false
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 shadow-lg bg-surface
          transition-transform duration-300
          overflow-hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:rounded-l-2xl
        `}
        style={{ width, pointerEvents: open ? "auto" : "none" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full w-full rounded-none md:rounded-l-2xl">
          {children}
        </div>
      </div>
    </>
  );
}
