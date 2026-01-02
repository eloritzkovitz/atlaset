import { useEffect, useRef } from "react";
import type { Key, KeyHandler, Modifier } from "@types";

/**
 * Generic hook for handling keyboard events with optional modifier keys.
 * @param handler - Function to call when a matching key is pressed.
 * @param keys - Array of key names to listen for (e.g., ["Escape", "ArrowLeft"]). Empty array means all keys.
 * @param enabled - If false, disables the handler.
 * @param modifiers - Array of required modifier keys (e.g., ["Ctrl", "Shift"]).
 */
export function useKeyHandler(
  handler: KeyHandler,
  keys: Key[] = [],
  enabled: boolean = true,
  modifiers: Modifier[] = []
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if focus is on input, textarea, or contenteditable
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      // Check if the pressed key and modifiers match
      const keyMatch = keys.length === 0 || keys.includes(e.key as Key);
      const modifiersMatch =
        (!modifiers.includes("Ctrl") || e.ctrlKey) &&
        (!modifiers.includes("Alt") || e.altKey) &&
        (!modifiers.includes("Shift") || e.shiftKey) &&
        (!modifiers.includes("Meta") || e.metaKey);

      if (keyMatch && modifiersMatch) {
        handlerRef.current(e);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, enabled, modifiers]);
}
