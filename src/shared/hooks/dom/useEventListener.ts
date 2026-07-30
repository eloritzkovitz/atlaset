import { useEffect, useLayoutEffect, useMemo, useRef } from "react";

/**
 * Manages DOM event listeners.
 * @param target - The target element to attach the event listener to. Defaults to `window` if not provided.
 * @param event - The name of the event to listen for.
 * @param handler - The function to call when the event is triggered.
 * @param options - Optional options for the event listener, such as `capture`, `once`, and `passive`.
 */
export function useEventListener<T extends Event = Event>(
  eventName: string | string[],
  handler: (event: T) => void,
  element?: EventTarget | null,
  options?: boolean | AddEventListenerOptions,
) {
  const savedHandler = useRef(handler);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Sync ref before paint so events never hit a stale closure
  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const eventNamesKey = Array.isArray(eventName)
    ? eventName.join(",")
    : eventName;

  const optionsKey =
    typeof options === "object" && options !== null
      ? JSON.stringify(options)
      : options;

  const eventNames = useMemo(
    () => (Array.isArray(eventName) ? eventName : [eventName]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventNamesKey],
  );

  // Manage event listener subscription and cleanup
  useEffect(() => {
    const targetElement = element ?? window;
    if (!targetElement || !targetElement.addEventListener) return;

    const eventListener: EventListener = (event) =>
      savedHandler.current(event as T);

    eventNames.forEach((name) => {
      targetElement.addEventListener(name, eventListener, options);
    });

    return () => {
      eventNames.forEach((name) => {
        targetElement.removeEventListener(name, eventListener, options);
      });
    };
  }, [element, eventNames, options, optionsKey]);
}
