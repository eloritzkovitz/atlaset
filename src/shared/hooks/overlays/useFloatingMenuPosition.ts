import { useCallback, useLayoutEffect, useState } from "react";
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

  // Update position based on main menu and floating menu dimensions, as well as window size
  const updatePosition = useCallback(() => {
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

      if (mainRect.right + floatingWidth > windowWidth) {
        left = mainRect.left - floatingWidth;
      } else {
        left = mainRect.right;
      }

      top = mainRect.top;

      if (top + floatingHeight > windowHeight) {
        top = Math.max(windowHeight - floatingHeight - 8, 8);
      }

      if (top < 8) {
        top = 8;
      }
    }

    setPosition({ left, top });
  }, [mainMenuRef, floatingMenuRef, defaultLeft, defaultTop]);

  // Initial position calculation and updates on window resize/scroll
  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEventListener("resize", updatePosition);
  useEventListener("scroll", updatePosition);

  return position;
}
