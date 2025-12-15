import { useCallback, useRef, useEffect } from "react";

/**
 * Enables infinite scrolling by returning a ref for the sentinel element.
 * When the sentinel comes into view, the provided callback is invoked.
 * @param callback Function to call when the sentinel is intersecting
 * @param enabled Whether infinite scrolling is enabled
 * @returns Ref callback to be assigned to the sentinel element
 */
export function useInfiniteScroll(callback: () => void, enabled: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (node && enabled) {
        observerRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        });
        observerRef.current.observe(node);
      }
    },
    [callback, enabled]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return ref;
}
