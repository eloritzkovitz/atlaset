import { useEffect } from "react";

/**
 * Locks the body scroll when enabled is true. Restores scroll when disabled or on unmount.
 * @param enabled Whether to lock body scroll
 */
export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [enabled]);
}
