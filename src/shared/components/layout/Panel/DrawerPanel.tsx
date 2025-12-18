import type { ReactNode } from "react";

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
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div
        className="fixed top-0 left-0 h-full z-50 shadow-lg transition-transform duration-300 bg-surface"
        style={{ width }}
      >
        {children}
      </div>
    </>
  );
}
