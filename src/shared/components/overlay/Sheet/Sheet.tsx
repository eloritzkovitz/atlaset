import { useEffect, useState, type ReactNode } from "react";
import { useBodyScrollLock, useDismiss } from "@hooks";
import { Backdrop } from "../Backdrop/Backdrop";
import { OverlayPortal } from "../OverlayPortal/OverlayPortal";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  disableClose?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Sheet({
  open,
  onClose,
  children,
  disableClose = false,
  className = "",
  style,
}: SheetProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useDismiss({
    show: open,
    onHide: onClose,
    isModal: true,
    escEnabled: !disableClose,
  });
  useBodyScrollLock(mounted);

  // Handle mounting and unmounting of the sheet with animation
  useEffect(() => {
    if (!open) {
      setVisible(false);
      const timeout = window.setTimeout(() => setMounted(false), 200);
      return () => window.clearTimeout(timeout);
    }

    setMounted(true);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!mounted) return null;

  return (
    <OverlayPortal>
      {open && !disableClose && (
        <Backdrop className="z-[10000]" onClick={onClose} />
      )}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-x-0 bottom-0 z-[10001] max-h-[92dvh] rounded-t-2xl bg-surface shadow-lg transition-transform duration-200 ease-out ${
          visible ? "translate-y-0" : "translate-y-full"
        } ${className}`}
        style={style}
      >
        {children}
      </div>
    </OverlayPortal>
  );
}
