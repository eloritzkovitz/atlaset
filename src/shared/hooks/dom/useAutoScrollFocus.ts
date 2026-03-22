import { useEffect } from "react";

type Ref<T> = React.RefObject<T | null>;

interface UseAutoScrollFocusOptions {
  enabled?: boolean;
  centerInline?: boolean;
}

// Tracks the last input modality (keyboard vs mouse/touch) to conditionally apply focus styles and behavior.
let lastInputWasKeyboard = false;
let lastInputListenersAttached = false;

// Event handlers to track input modality
function onKeydown() {
  lastInputWasKeyboard = true;
}

function onPointerDown() {
  lastInputWasKeyboard = false;
}

function ensureLastInputListeners() {
  if (lastInputListenersAttached) return;
  if (typeof window === "undefined") return;

  window.addEventListener("keydown", onKeydown, true);
  window.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("mousedown", onPointerDown, true);
  window.addEventListener("touchstart", onPointerDown, true);

  lastInputListenersAttached = true;
}

// Test helpers
export function __setLastInputWasKeyboardForTests(val: boolean) {
  lastInputWasKeyboard = val;
}

/**
 * Scrolls a child element (found by selector) into view inside a container and focuses it.
 * Useful for segmented toggles and similar horizontal lists.
 */
export function useAutoScrollFocus(
  containerRef: Ref<HTMLElement>,
  targetSelector: string | null,
  options: UseAutoScrollFocusOptions = {},
) {
  const { enabled = true, centerInline = true } = options;

  // Ensure we know the last input modality, then scroll and (maybe) focus
  ensureLastInputListeners();

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
    } catch {
      el.scrollIntoView();
    }

    // Only programmatically focus when the last input was keyboard. This
    // prevents a visible focus ring after mouse/touch interactions while
    // preserving accessibility for keyboard users.
    if (lastInputWasKeyboard) {
      try {
        el.focus({ preventScroll: true });
      } catch {
        try {
          el.focus();
        } catch {
          void 0;
        }
      }
    }
  }, [containerRef, targetSelector, enabled, centerInline]);
}

export default useAutoScrollFocus;
