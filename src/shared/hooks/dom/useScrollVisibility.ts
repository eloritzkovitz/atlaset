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
    setIsScrollable(isElementScrollable(el));
  }, [elementRef, deps]);

  // Observe mutations to update scrollability
  useMutationObserver(elementRef, () => {
    setIsScrollable(isElementScrollable(elementRef.current));
  });

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

  useEventListener(
    "resize",
    () => {
      setIsScrollable(isElementScrollable(elementRef.current));
    },
    window,
  );

  return [scrollState, isScrollable] as const;
}

// exported for testing
export function isElementScrollable(el: HTMLElement | null | undefined) {
  if (!el) return false;
  return el.scrollHeight > el.clientHeight;
}
