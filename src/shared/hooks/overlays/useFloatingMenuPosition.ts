import { useState, useLayoutEffect } from "react";
import { useEventListener } from "../dom/useEventListener";

/**
 * Calculates floating menu position (left/top) relative to a main menu.
 * Handles window resize and scroll events for responsive positioning.
 */
export function useFloatingMenuPosition(
  mainMenuRef: React.RefObject<HTMLElement | null>,
  floatingMenuRef: React.RefObject<HTMLElement | null>,
  defaultLeft: number,
  defaultTop: number,
): { left: number; top: number } {
  const [position, setPosition] = useState({
    left: defaultLeft,
    top: defaultTop,
  });

  // Calculate position on mount and when refs change
  function updatePosition() {
    const mainMenu = mainMenuRef.current;
    const floatingMenu = floatingMenuRef.current;
    let left = defaultLeft;
    let top = defaultTop;
    if (mainMenu && floatingMenu) {
      const mainRect = mainMenu.getBoundingClientRect();
      const floatingWidth = floatingMenu.offsetWidth || 180;
      const floatingHeight = floatingMenu.offsetHeight || 300;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      // Left: position to left if not enough space on right
      if (mainRect.right + floatingWidth > windowWidth) {
        left = mainRect.left - floatingWidth;
      } else {
        left = mainRect.right;
      }
      // Top: align tops, adjust for overflow
      top = mainRect.top;
      if (top + floatingHeight > windowHeight) {
        top = Math.max(windowHeight - floatingHeight - 8, 8);
      }
      if (top < 8) {
        top = 8;
      }
    }
    setPosition({ left, top });
  }

  useLayoutEffect(() => {
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainMenuRef, floatingMenuRef, defaultLeft, defaultTop]);

  useEventListener("resize", updatePosition);
  useEventListener("scroll", updatePosition);

  return position;
}
