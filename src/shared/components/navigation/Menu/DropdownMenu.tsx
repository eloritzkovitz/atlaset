import { useLayoutEffect } from "react";
import {
  autoUpdate,
  offset,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { useClickOutside } from "@hooks";
import { Menu } from "./Menu";

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  enabled?: boolean;
  floating?: boolean;
  placement?: Placement;
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function DropdownMenu({
  isOpen,
  onClose,
  triggerRef,
  children,
  enabled = true,
  floating = true,
  placement = "bottom-end",
  offset: offsetDistance = 8,
  className = "z-50 p-2",
  style,
}: DropdownMenuProps) {
  const isVisible = isOpen && enabled;

  const { refs, floatingStyles } = useFloating({
    open: isVisible && floating,
    placement,
    strategy: "fixed",
    transform: false,
    middleware: [offset(offsetDistance)],
    whileElementsMounted: autoUpdate,
  });

  // Update the reference element for the floating UI when the menu is open
  useLayoutEffect(() => {
    if (!floating) return;

    refs.setReference(triggerRef.current);

    return () => {
      refs.setReference(null);
    };
  }, [floating, triggerRef, refs]);

  useClickOutside([triggerRef, refs.floating], onClose, isVisible);

  // Don't render the menu if it's not visible
  if (!isVisible) return null;

  return (
    <Menu
      open
      containerRef={floating ? refs.setFloating : undefined}
      disableScroll
      style={{
        ...(floating ? floatingStyles : {}),
        ...style,
      }}
      className={className}
    >
      {children}
    </Menu>
  );
}
