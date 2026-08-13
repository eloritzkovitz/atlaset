import { useEventListener } from "./useEventListener";

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
export function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  onOutside: () => void,
  enabled = true,
  options: UseClickOutsideOptions = { click: true, escape: true },
) {
  // Handler for click outside
  const handleClickOutside = (e: MouseEvent | PointerEvent) => {
    if (!enabled || options.click === false) return;
    if (
      refs.every(
        (ref) =>
          !ref.current ||
          !(e.target instanceof Node) ||
          !ref.current.contains(e.target),
      )
    ) {
      onOutside();
    }
  };

  // Handler for scroll or resize outside
  const handleScrollOrResize = (e: Event) => {
    if (!enabled || (!options.scroll && !options.resize)) return;
    if (
      refs.every(
        (ref) =>
          !ref.current ||
          !(e.target instanceof Node) ||
          !ref.current.contains(e.target),
      )
    ) {
      onOutside();
    }
  };

  // Handler for Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!enabled || options.escape === false) return;
    if (e.key === "Escape") onOutside();
  };

  useEventListener("mousedown", handleClickOutside, window);
  useEventListener("pointerdown", handleClickOutside, window);
  useEventListener("scroll", handleScrollOrResize, window, { capture: true });
  useEventListener("resize", handleScrollOrResize, window);
  useEventListener("keydown", handleKeyDown, window);
}
