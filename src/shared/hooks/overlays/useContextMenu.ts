import {
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
  useLayoutEffect,
} from "react";
import type React from "react";
import type { Point } from "@types";
import { useClickOutside } from "../dom/useClickOutside";
import { useKeyHandler } from "../input/useKeyHandler";

interface UseContextMenuProps {
  standardMenuStyle?: React.CSSProperties;
  zIndex?: number;
  disabled?: boolean;
  forwardedRef?: React.Ref<unknown>;
  ignoreRefs?: React.RefObject<HTMLElement | null>[];
  onClose?: () => void;
}

const DEFAULT_STYLE: React.CSSProperties = {};

/**
 * Manages context menu state and positioning for components that require right-click functionality.
 * @param standardMenuStyle - Optional styles for standard (non-context) menu positioning.
 * @param zIndex - The z-index for the context menu.
 * @param disabled - Whether the context menu is disabled.
 * @param forwardedRef - Ref for imperative control of the context menu (e.g., opening at specific coordinates).
 * @param ignoreRefs - Array of refs to elements that should not trigger menu closure when clicked.
 * @param onClose - Optional callback invoked when the context menu is closed.
 * @returns An object containing context menu state, styles, and handlers for opening/closing the menu.
 */
export function useContextMenu({
  standardMenuStyle = DEFAULT_STYLE,
  zIndex = 1000,
  disabled = false,
  forwardedRef,
  ignoreRefs = [],
  onClose,
}: UseContextMenuProps = {}) {
  const [contextCoords, setContextCoords] = useState<Point | null>(null);
  const [open, setOpen] = useState(false);
  const [computedStyle, setComputedStyle] = useState<React.CSSProperties>({});

  const menuRef = useRef<HTMLElement | null>(null);

  // Handler to open context menu at cursor position
  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      e.preventDefault();
      e.stopPropagation();

      setContextCoords({ x: e.clientX, y: e.clientY });
      setOpen(true);
    },
    [disabled],
  );

  // Open menu at specific coordinates
  const openAtCoordinates = useCallback((x: number, y: number) => {
    setContextCoords({ x, y });
    setOpen(true);
  }, []);

  // Handler to close the context menu and reset coordinates
  const handleCloseContext = useCallback(() => {
    setOpen(false);
    setContextCoords(null);
    onClose?.();
  }, [onClose]);

  // Imperative handle registration for external control of menu opening
  useImperativeHandle(
    forwardedRef,
    () => ({
      openAtCoordinates,
    }),
    [openAtCoordinates],
  );

  // Combine ignoreRefs with the menuRef to prevent closing when clicking inside the menu
  const combinedIgnoreRefs = [menuRef, ...ignoreRefs];

  // Close menu on outside click or Escape key press
  useClickOutside(
    combinedIgnoreRefs as React.RefObject<HTMLElement>[],
    handleCloseContext,
    open,
  );
  useKeyHandler(handleCloseContext, ["Escape"], {
    enabled: open,
    target: combinedIgnoreRefs[0],
  });

  // Calculate menu position when open or dependencies change
  useLayoutEffect(() => {
    if (open && contextCoords) {
      let left = contextCoords.x;
      let top = contextCoords.y;

      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();

        if (left + menuRect.width > window.innerWidth) {
          left = left - menuRect.width;
          if (left < 0) left = 4;
        }

        if (top + menuRect.height > window.innerHeight) {
          top = top - menuRect.height;
          if (top < 0) top = 4;
        }
      }

      setComputedStyle({
        position: "fixed",
        left,
        top,
        transform: "none",
        zIndex,
      });
    } else {
      setComputedStyle(standardMenuStyle);
    }
  }, [open, contextCoords, zIndex, standardMenuStyle]);

  return {
    open,
    setOpen,
    menuStyle: computedStyle,
    menuRef,
    contextCoords,
    handleContextMenu,
    openAtCoordinates,
    handleCloseContext,
  };
}
