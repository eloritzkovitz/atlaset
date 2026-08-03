import { useEffect, useRef } from "react";
import type { Key, KeyHandler, Modifier } from "@types";
import {
  isRestrictedSingleKey,
  isTextInputFocused,
  matchModifiers,
} from "@utils";

export interface KeyHandlerOptions {
  enabled?: boolean;
  modifiers?: Modifier[];
  allowSingleKeyShortcuts?: boolean;
  target?: EventTarget | React.RefObject<EventTarget | null>;
}

/**
 * Handles keyboard events with optional modifier keys.
 * @param handler - Function to call when a matching key is pressed.
 * @param keys - Array of key names to listen for. Empty array means all keys.
 * @param options - Configuration options.
 */
export function useKeyHandler(
  handler: KeyHandler,
  keys: Key[] = [],
  options: KeyHandlerOptions = {},
) {
  const {
    enabled = true,
    modifiers = [],
    allowSingleKeyShortcuts = false,
    target = window,
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: Event) => {
      const event = e as KeyboardEvent;

      // Ignore events if a text input is focused
      if (isTextInputFocused()) return;

      // Check if the key is a restricted single-character key without modifiers
      const isCharacterShortcut = isRestrictedSingleKey({
        key: event.key as Key,
        modifiers,
      });

      // If single-character shortcuts are disabled, ignore the event
      if (isCharacterShortcut && !allowSingleKeyShortcuts) {
        return;
      }

      // Check key registration arrays match
      const keyMatch = keys.length === 0 || keys.includes(event.key as Key);

      // Check modifier combinations match using our extracted helper
      const modifiersMatch = matchModifiers(event, modifiers);

      if (keyMatch && modifiersMatch) {
        event.stopPropagation();
        handlerRef.current(event);
      }
    };

    const activeTarget =
      target && "current" in target ? target.current : target;
    if (!activeTarget) return;

    activeTarget.addEventListener("keydown", handleKeyDown);
    return () => activeTarget.removeEventListener("keydown", handleKeyDown);
  }, [enabled, keys, modifiers, target, allowSingleKeyShortcuts]);
}
