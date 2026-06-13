import { useState, useCallback, useImperativeHandle } from "react";
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
  standardMenuStyle = {},
  zIndex = 1000,
  disabled = false,
  forwardedRef,
  ignoreRefs = [],
  onClose,
}: UseContextMenuProps = {}) {
  const [contextCoords, setContextCoords] = useState<Point | null>(null);
  const [open, setOpen] = useState(false);

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

  // Close menu on outside click or Escape key press
  useClickOutside(
    ignoreRefs as React.RefObject<HTMLElement>[],
    handleCloseContext,
    open,
  );
  useKeyHandler(handleCloseContext, ["Escape"], open, [], ignoreRefs[0]);

  // Compute polymorphic positioning styles dynamically
  const menuStyle: React.CSSProperties = contextCoords
    ? {
        position: "fixed",
        left: contextCoords.x,
        top: contextCoords.y,
        transform: "none",
        zIndex,
      }
    : standardMenuStyle;

  return {
    open,
    setOpen,
    menuStyle,
    contextCoords,
    handleContextMenu,
    openAtCoordinates,
    handleCloseContext,
  };
}
