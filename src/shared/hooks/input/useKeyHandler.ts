import { useRef } from "react";
import type { Key, KeyHandler, Modifier } from "@types";
import { useEventListener } from "../dom/useEventListener";

/**
 * Handles keyboard events with optional modifier keys.
 * @param handler - Function to call when a matching key is pressed.
 * @param keys - Array of key names to listen for (e.g., ["Escape", "ArrowLeft"]). Empty array means all keys.
 * @param enabled - If false, disables the handler.
 * @param modifiers - Array of required modifier keys (e.g., ["Ctrl", "Shift"]).
 */
export function useKeyHandler(
  handler: KeyHandler,
  keys: Key[] = [],
  enabled: boolean = true,
  modifiers: Modifier[] = [],
) {
  const handlerRef = useRef(handler);

  // Update ref if handler changes
  handlerRef.current = handler;

  useEventListener(
    "keydown",
    (e: Event) => {
      if (!enabled) return;
      const event = e as KeyboardEvent;
      // Ignore if focus is on input, textarea, or contenteditable
      const tag = (document.activeElement?.tagName || "").toLowerCase();

      // Check if active element is an input, textarea, or contenteditable
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      // If focus is on an input, ignore the key event to avoid interfering with typing
      if (isInput) return;

      // Check if the pressed key and modifiers match
      const keyMatch = keys.length === 0 || keys.includes(event.key as Key);

      // Check if all required modifiers are pressed
      const modifiersMatch =
        (!modifiers.includes("Ctrl") || event.ctrlKey) &&
        (!modifiers.includes("Alt") || event.altKey) &&
        (!modifiers.includes("Shift") || event.shiftKey) &&
        (!modifiers.includes("Meta") || event.metaKey);
      if (keyMatch && modifiersMatch) {
        handlerRef.current(event);
      }
    },
    window,
  );
}
