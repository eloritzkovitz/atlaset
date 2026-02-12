import { useState, useEffect } from "react";

/** Helper for SSR-safe window check */
export function isWindowDefined() {
  return typeof window !== "undefined";
}

/**
 * Determines the current screen size based on a width threshold.
 * Returns an object with boolean flags for isMobile, isLaptop, and isDesktop.
 */
export function useScreenSize() {
  const [width, setWidth] = useState(() => isWindowDefined() ? window.innerWidth : 0);

  useEffect(() => {
    if (!isWindowDefined()) return;
    const check = () => setWidth(window.innerWidth);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isMobile = width < 768;
  const isLaptop = width >= 1024 && width < 1280;
  const isDesktop = width >= 1280;

  return { isMobile, isLaptop, isDesktop, width };
}
