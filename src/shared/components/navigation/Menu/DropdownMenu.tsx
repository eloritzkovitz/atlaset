import { useLayoutEffect } from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { useClickOutside } from "@hooks";
import { Menu } from "./Menu";
import type { OverlayProps, TriggerProps } from "../../overlay/types";

export interface DropdownMenuProps extends OverlayProps, TriggerProps {
  children: React.ReactNode;
  enabled?: boolean;
  floating?: boolean;
  placement?: Placement;
  offset?: number;
  matchTriggerWidth?: boolean;
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
  matchTriggerWidth = false,
  className = "z-50 p-2",
  style,
}: DropdownMenuProps) {
  const isVisible = isOpen && enabled;

  const { refs, floatingStyles, update } = useFloating({
    open: isVisible && floating,
    placement,
    strategy: "fixed",
    transform: false,
    middleware: [
      offset(offsetDistance),
      flip(),
      shift({ padding: 8 }),
      ...(matchTriggerWidth
        ? [
            size({
              apply({ rects, elements }) {
                elements.floating.style.width = `${rects.reference.width}px`;
              },
            }),
          ]
        : []),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Set the reference element for the floating UI to the trigger element
  useLayoutEffect(() => {
    if (!floating) return;

    refs.setReference(triggerRef.current);

    return () => {
      refs.setReference(null);
    };
  }, [floating, triggerRef, refs]);

  // Update the position of the floating menu when it becomes visible
  useLayoutEffect(() => {
    if (!floating || !isVisible) return;

    void update();
  }, [floating, isVisible, placement, update]);

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
