import {  useEffect, useRef } from "react";
import type { Key, KeyHandler, Modifier } from "@types";

/**
 * Handles keyboard events with optional modifier keys.
 * @param handler - Function to call when a matching key is pressed.
 * @param keys - Array of key names to listen for (e.g., ["Escape", "ArrowLeft"]). Empty array means all keys.
 * @param enabled - If false, disables the handler.
 * @param modifiers - Array of required modifier keys (e.g., ["Ctrl", "Shift"]).
 * @param target - Optional specific element or ref to listen to instead of the global window.
 */
export function useKeyHandler(
  handler: KeyHandler,
  keys: Key[] = [],
  enabled: boolean = true,
  modifiers: Modifier[] = [],
  target: EventTarget | React.RefObject<EventTarget | null> = window,
) {
  const handlerRef = useRef(handler);

  // Update ref if handler changes
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: Event) => {
      const event = e as KeyboardEvent;

      // Ignore if focus is on input, textarea, or contenteditable
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      const isInput =
        tag === "input" ||
        tag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

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
        event.stopPropagation();
        handlerRef.current(event);
      }
    };

    // Resolve the target element to attach the event listener
    const activeTarget =
      target && "current" in target ? target.current : target;
    if (!activeTarget) return;

    // Add the event listener to the resolved target
    activeTarget.addEventListener("keydown", handleKeyDown);

    return () => {
      activeTarget.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, keys, modifiers, target]);
}
