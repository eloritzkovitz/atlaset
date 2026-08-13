import type { CSSProperties, ReactNode, Ref } from "react";
import { Modal } from "../../overlay/Modal/Modal";

interface MenuProps {
  open: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  containerRef?: Ref<HTMLDivElement>;
  disableScroll?: boolean;
  extraRefs?: React.RefObject<HTMLElement | null>[];
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
  extraRefs = [],
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
      className={`menu !bg-surface-alt shadow-lg rounded z-50 !p-2 ${className}`}
      style={style}
      containerRef={containerRef}
      extraRefs={extraRefs}
    >
      {children}
    </Modal>
  );
}
