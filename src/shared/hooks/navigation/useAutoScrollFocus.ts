import { useEffect } from "react";

/**
 * Automatically scrolls and focuses a target element within a container when the target is selected.
 * @param containerRef - A React ref to the container element that holds the target element.
 * @param targetSelector - A CSS selector string to identify the target element within the container.
 * @param options - Optional settings for the auto-scroll and focus behavior.
 */
export function useAutoScrollFocus(
  containerRef: React.RefObject<HTMLElement | null>,
  targetSelector: string | null,
  options: { enabled?: boolean; centerInline?: boolean } = {},
) {
  const { enabled = true, centerInline = true } = options;

  useEffect(() => {
    if (!enabled || !targetSelector) return;
    const container = containerRef.current;
    const el = container?.querySelector<HTMLElement>(targetSelector);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      inline: centerInline ? "center" : "nearest",
      block: "nearest",
    });

    el.focus({ preventScroll: true });
  }, [containerRef, targetSelector, enabled, centerInline]);
}
