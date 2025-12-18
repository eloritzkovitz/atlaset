import { useState, useEffect } from "react";

/** Helper for SSR-safe window check */
export function isWindowDefined() {
  return typeof window !== "undefined";
}

/**
 * Determines if the current viewport width classifies as mobile.
 * @returns
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    isWindowDefined() ? window.innerWidth < breakpoint : false
  );

  // Update on window resize
  useEffect(() => {
    if (!isWindowDefined()) return;
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
