import { useEffect, useRef } from "react";

/**
 * Manages DOM event listeners.
 * @param target - element or window (default: window)
 * @param event - event name (e.g., 'scroll', 'resize', 'click')
 * @param handler - event handler function
 * @param options - event listener options
 */
export function useEventListener(
  event: string,
  handler: (event: Event) => void,
  target?: EventTarget | null,
  options?: AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  // Update ref if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  // Add event listener on mount and clean up on unmount
  useEffect(() => {
    const tgt = target ?? window;
    const eventListener = (event: Event) => savedHandler.current(event);
    if (tgt) {
      tgt.addEventListener(event, eventListener, options);
    }
    return () => {
      if (tgt) {
        tgt.removeEventListener(event, eventListener, options);
      }
    };
  }, [event, target, options]);
}
