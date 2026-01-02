import { useEffect } from "react";

type UseClickOutsideOptions = {
  click?: boolean;
  escape?: boolean;
  scroll?: boolean;
  resize?: boolean;
};

/**
 * Detects clicks outside of the given refs and calls the onOutside callback.
 * @param refs - Array of refs to monitor
 * @param onOutside - Callback to invoke on outside click
 * @param enabled - Whether the hook is enabled
 * @param options - Options to enable/disable specific event types
 */
export function useClickOutside<T extends HTMLElement>(
  refs: React.RefObject<T>[],
  onOutside: () => void,
  enabled = true,
  options: UseClickOutsideOptions = { click: true, escape: true }
) {
  useEffect(() => {
    if (!enabled) return;

    // Handle click outside of all refs
    function handleClickOutside(e: MouseEvent) {
      if (
        refs.every(
          (ref) =>
            !ref.current ||
            !(e.target instanceof Node) ||
            !ref.current.contains(e.target)
        )
      ) {
        onOutside();
      }
    }

    // Handle scroll or resize outside of all refs
    function handleScrollOrResize(e: Event) {
      if (
        refs.every(
          (ref) =>
            !ref.current ||
            !(e.target instanceof Node) ||
            !ref.current.contains(e.target)
        )
      ) {
        onOutside();
      }
    }

    // Handle Escape key press
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOutside();
    }

    if (options.click !== false) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    if (options.scroll) {
      window.addEventListener("scroll", handleScrollOrResize, true);
    }
    if (options.resize) {
      window.addEventListener("resize", handleScrollOrResize);
    }
    if (options.escape !== false) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (options.click !== false) {
        window.removeEventListener("mousedown", handleClickOutside);
      }
      if (options.scroll) {
        window.removeEventListener("scroll", handleScrollOrResize, true);
      }
      if (options.resize) {
        window.removeEventListener("resize", handleScrollOrResize);
      }
      if (options.escape !== false) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [refs, onOutside, enabled, options]);
}
