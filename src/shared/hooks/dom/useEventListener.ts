import { useEffect, useRef } from "react";

/**
 * Manages DOM event listeners.
 * @param target - element or window (default: window)
 * @param event - event name (e.g., 'scroll', 'resize', 'click')
 * @param handler - event handler function
 * @param options - event listener options
 */
export function useEventListener<T extends Event = Event>(
  event: string,
  handler: (event: T) => void,
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
    const tgt = (target ?? window) as EventTarget;
    const eventListener = (event: Event) => savedHandler.current(event as T);
    tgt.addEventListener(event, eventListener, options);
    return () => {
      tgt.removeEventListener(event, eventListener, options);
    };
  }, [event, target, options]);
}
