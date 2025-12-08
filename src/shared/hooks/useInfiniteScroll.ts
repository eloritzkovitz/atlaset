import { useEffect } from "react";

/**
 * Enables infinite scrolling by observing the given ref element.
 * @param ref - RefObject of the element to observe
 * @param callback - Function to call when the element is in view
 * @param enabled - Whether the infinite scroll is enabled
 */
export function useInfiniteScroll(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  enabled: boolean
) {
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
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [callback, enabled, ref]);
}
