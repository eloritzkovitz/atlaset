import { useEffect } from "react";

type Ref<T> = React.RefObject<T | null>;

interface UseAutoScrollFocusOptions {
  enabled?: boolean;
  centerInline?: boolean;
}

/**
 * Scrolls a child element (found by selector) into view inside a container and focuses it.
 * Useful for segmented toggles and similar horizontal lists.
 */
export function useAutoScrollFocus(
  containerRef: Ref<HTMLElement>,
  targetSelector: string | null,
  options: UseAutoScrollFocusOptions = {}
) {
  const { enabled = true, centerInline = true } = options;

  // Scroll and focus logic
  useEffect(() => {
    if (!enabled) return;
    if (!targetSelector) return;
    const container = containerRef.current;
    if (!container) return;

    const el = container.querySelector<HTMLElement>(targetSelector);
    if (!el) return;

    try {
      el.scrollIntoView({
        behavior: "smooth",
        inline: centerInline ? "center" : "nearest",
        block: "nearest",
      } as ScrollIntoViewOptions);
    } catch (e) {
      el.scrollIntoView();
    }

    // Focus if possible without scrolling again
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      try {
        el.focus();
      } catch {}
    }
  }, [containerRef, targetSelector, enabled, centerInline]);
}

export default useAutoScrollFocus;
