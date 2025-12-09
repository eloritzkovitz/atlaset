import { useEffect, useRef } from "react";

/**
 * Enables infinite scrolling by returning a ref for the sentinel element.
 * @param callback - Function to call when the element is in view
 * @param enabled - Whether the infinite scroll is enabled
 * @returns sentinelRef - Attach this to your sentinel div
 */
export function useInfiniteScroll(callback: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Set up Intersection Observer
  useEffect(() => {
    if (!enabled) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold: 1 }
    );
    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [callback, enabled]);

  return sentinelRef;
}
