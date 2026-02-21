import { useState } from "react";
import { useEventListener } from "../dom/useEventListener";
import { isWindowDefined } from "../../utils/env";

/**
 * Determines the current screen size based on a width threshold.
 * Returns an object with boolean flags for isMobile, isLaptop, and isDesktop.
 */
export function useScreenSize() {
  const [width, setWidth] = useState(() =>
    isWindowDefined() ? window.innerWidth : 0,
  );

  // Use useEventListener for resize event
  useEventListener(
    "resize",
    () => setWidth(window.innerWidth),
    isWindowDefined() ? window : undefined,
  );

  const isMobile = width < 768;
  const isLaptop = width >= 1024 && width < 1280;
  const isDesktop = width >= 1280;

  return { isMobile, isLaptop, isDesktop, width };
}
