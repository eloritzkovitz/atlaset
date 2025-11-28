import { useEffect, useState } from "react";

/**
 * Manages keyboard focus ring visibility.
 * @returns Whether to show the focus ring.
 */
export function useKeyboardFocusRing() {
  const [showRing, setShowRing] = useState(false);

  // Track if last interaction was keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") setShowRing(true);
    };
    const handleMouseDown = () => setShowRing(false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return showRing;
}
