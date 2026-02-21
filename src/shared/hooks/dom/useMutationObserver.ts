import { useEffect } from "react";

/**
 * Observes DOM mutations.
 * @param elementRef - ref to the element to observe
 * @param callback - mutation callback
 * @param options - MutationObserver options
 */
export function useMutationObserver(
  elementRef: React.RefObject<HTMLElement | null>,
  callback: MutationCallback,
  options: MutationObserverInit = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  },
) {
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const observer = new MutationObserver(callback);
    observer.observe(el, options);
    return () => {
      observer.disconnect();
    };
  }, [elementRef, callback, options]);
}
