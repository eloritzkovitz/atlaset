import type { ReactNode, CSSProperties } from "react";
import { Modal } from "@components";

interface MenuProps {
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  disableScroll?: boolean;
}

export function Menu({
  open,
  onMouseEnter,
  onMouseLeave,
  onClose,
  children,
  className = "",
  style,
  containerRef,
  disableScroll = false,
}: MenuProps) {
  
  return (
    <Modal
      isOpen={open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClose={onClose}
      disableClose={false}
      disableScroll={disableScroll}
      position="custom"
      className={`menu !bg-surface-alt rounded shadow-lg z-50 !p-2 ${className}`}
      style={style}
      containerRef={containerRef}      
    >
      {children}
    </Modal>
  );
}
