import { useEffect, useState } from "react";
import { useEventListener } from "./useEventListener";
import { useMutationObserver } from "./useMutationObserver";

/**
 * Manages scroll visibility and scrollability for any element.
 * @param elementRef - ref to the scrollable element
 * @param onScroll - callback for scroll event (receives scrollTop)
 * @param deps - dependencies (e.g., children)
 * @param initialState - optional initial state for scrollState
 * @returns [scrollState, isScrollable]
 */
export function useScrollVisibility<T = unknown>(
  elementRef: React.RefObject<HTMLElement | null>,
  onScroll?: (scrollTop: number) => T,
  deps: unknown[] = [],
  initialState?: T,
) {
  const [scrollState, setScrollState] = useState<T>(
    initialState !== undefined ? initialState : (undefined as unknown as T),
  );
  const [isScrollable, setIsScrollable] = useState(false);

  // Check scrollability
  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    setIsScrollable(el.scrollHeight > el.clientHeight);
  }, [elementRef, deps]);

  // Observe mutations to re-check scrollability
  useMutationObserver(elementRef, () => {
    const el = elementRef.current;
    if (!el) return;
    setIsScrollable(el.scrollHeight > el.clientHeight);
  });

  // Use useEventListener for scroll
  useEventListener(
    "scroll",
    () => {
      const el = elementRef.current;
      if (!el) return;
      const scrollTop = el.scrollTop;
      if (onScroll) {
        setScrollState(onScroll(scrollTop));
      }
    },
    elementRef.current,
  );

  // Use useEventListener for resize
  useEventListener(
    "resize",
    () => {
      const el = elementRef.current;
      if (!el) return;
      setIsScrollable(el.scrollHeight > el.clientHeight);
    },
    window,
  );

  return [scrollState, isScrollable] as const;
}
