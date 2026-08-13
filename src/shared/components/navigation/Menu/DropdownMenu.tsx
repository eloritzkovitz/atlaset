import { useLayoutEffect, useState } from "react";
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

  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );

  // Update reference element when the dropdown is visible or the triggerRef changes
  useLayoutEffect(() => {
    if (isVisible) {
      setReferenceElement(triggerRef.current);
    } else {
      setReferenceElement(null);
    }
  }, [isVisible, triggerRef]);

  const { refs, floatingStyles } = useFloating({
    open: isVisible && floating,
    elements: {
      reference: referenceElement,
    },
    placement,
    strategy: "fixed",
    transform: false,
    middleware: [offset(offsetDistance)],
    whileElementsMounted: autoUpdate,
  });

  // Handle outside click to close the dropdown
  useClickOutside([triggerRef, refs.floating], onClose, isVisible);

  // Don't render anything if the dropdown is not visible
  if (!isVisible) {
    return null;
  }

  const positionStyle =
    floating && referenceElement ? floatingStyles : undefined;

  return (
    <Menu
      open={isVisible}
      onClose={onClose}
      containerRef={floating ? refs.setFloating : undefined}
      disableScroll
      style={{
        ...positionStyle,
        ...style,
      }}
      className={className}
    >
      {children}
    </Menu>
  );
}
