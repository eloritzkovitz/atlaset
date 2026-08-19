import type { CSSProperties, ReactNode, Ref } from "react";
import { useBodyScrollLock } from "@hooks";
import { OverlayPortal } from "../../overlay/OverlayPortal/OverlayPortal";
import "./Menu.css";

interface MenuProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  containerRef?: Ref<HTMLDivElement>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  disableScroll?: boolean;
}

export function Menu({
  open,
  children,
  className = "",
  style,
  containerRef,
  onMouseEnter,
  onMouseLeave,
  onClick,
  disableScroll = false,
}: MenuProps) {
  useBodyScrollLock(open && disableScroll);

  if (!open) return null;

  return (
    <OverlayPortal>
      {disableScroll && (
        <div
          className="fixed inset-0 z-40"
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        />
      )}

      <div
        ref={containerRef}
        className={`menu fixed z-50 rounded-xl bg-surface-alt p-2 shadow-lg ${className}`}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </div>
    </OverlayPortal>
  );
}
