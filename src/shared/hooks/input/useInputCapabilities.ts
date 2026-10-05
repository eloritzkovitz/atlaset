import { useCallback, useEffect, useRef, useState } from "react";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

// Returns the current input capabilities based on media queries and touch support.
export function getInputCapabilities() {
  if (typeof window === "undefined") {
    return { canHover: false, isTouchDevice: false };
  }

  return {
    canHover: window.matchMedia(HOVER_QUERY).matches,
    isTouchDevice:
      window.matchMedia(COARSE_POINTER_QUERY).matches ||
      navigator.maxTouchPoints > 0,
  };
}

/**
 * Tracks the input capabilities that affect pointer and focus interactions.
 */
export function useInputCapabilities() {
  const [canHover, setCanHover] = useState(
    () => getInputCapabilities().canHover,
  );
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => getInputCapabilities().isTouchDevice,
  );
  const touchInteractionRef = useRef(false);

  // Update capabilities on media query changes and touch support changes
  useEffect(() => {
    const hoverQuery = window.matchMedia(HOVER_QUERY);
    const coarsePointerQuery = window.matchMedia(COARSE_POINTER_QUERY);
    const updateCapabilities = () => {
      setCanHover(hoverQuery.matches);
      setIsTouchDevice(
        coarsePointerQuery.matches || navigator.maxTouchPoints > 0,
      );
    };

    updateCapabilities();
    hoverQuery.addEventListener("change", updateCapabilities);
    coarsePointerQuery.addEventListener("change", updateCapabilities);

    return () => {
      hoverQuery.removeEventListener("change", updateCapabilities);
      coarsePointerQuery.removeEventListener("change", updateCapabilities);
    };
  }, []);

  const handlePointerDown = useCallback((pointerType: string) => {
    touchInteractionRef.current = pointerType === "touch";
  }, []);

  const handleKeyDown = useCallback(() => {
    touchInteractionRef.current = false;
  }, []);

  const isTouchInteraction = useCallback(() => touchInteractionRef.current, []);

  return {
    canHover,
    isTouchDevice,
    isTouchInteraction,
    handlePointerDown,
    handleKeyDown,
  };
}
