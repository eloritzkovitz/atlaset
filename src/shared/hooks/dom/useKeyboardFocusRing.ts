import { useState } from "react";
import { useEventListener } from "./useEventListener";

/**
 * Manages keyboard focus ring visibility.
 * @returns Whether to show the focus ring.
 */
export function useKeyboardFocusRing() {
  const [showRing, setShowRing] = useState(false);

  // Track if last interaction was keyboard or mouse
  useEventListener(
    "keydown",
    (e: Event) => {
      if ((e as KeyboardEvent).key === "Tab") setShowRing(true);
    },
    window,
  );
  useEventListener("mousedown", () => setShowRing(false), window);

  return showRing;
}
