/**
 * Utilities for handling keyboard events and shortcuts.
 */

import { keyCommands } from "@constants/keyCommands";
import type { CommandId, KeyCommand, Modifier } from "@types";

/**
 * Determines if a keyboard command is a restricted single-character key without modifiers.
 * @param cmd - The keyboard command to evaluate.
 * @returns True if the command is a single-character key without modifiers, false otherwise.
 */
export function isRestrictedSingleKey(
  cmd: Pick<KeyCommand, "key" | "modifiers">,
): boolean {
  // Allow if a system modifier is present
  const hasSystemModifier = cmd.modifiers.some((mod) =>
    (["Ctrl", "Alt", "Meta"] as Modifier[]).includes(mod),
  );
  if (hasSystemModifier) return false;

  // Allow if Shift is explicitly declared
  if (cmd.modifiers.includes("Shift")) return false;

  // Allow system/navigation keys
  if (cmd.key.length > 1) return false;

  // Exclude certain symbols that may conflict with other shortcuts
  const isShiftSymbol = /^[!@#$%^&*()_+{}|:"<>?~]$/.test(cmd.key);
  if (isShiftSymbol) return false;

  return true;
}

/**
 * Detects if the currently active DOM element is an interactive text input area.
 * @returns True if the active element is an input, textarea, or contenteditable element; false otherwise.
 */
export function isTextInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tag = activeElement.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    !!(activeElement as HTMLElement).isContentEditable
  );
}

/**
 * Validates if the active browser KeyboardEvent perfectly matches the defined shortcut modifiers.
 * @param event - The keyboard event to check.
 * @param requiredModifiers - The list of required modifier keys.
 * @returns True if the event matches the required modifiers, false otherwise.
 */
export function matchModifiers(
  event: KeyboardEvent,
  requiredModifiers: readonly Modifier[],
): boolean {
  return (
    (!requiredModifiers.includes("Ctrl") || event.ctrlKey) &&
    (!requiredModifiers.includes("Alt") || event.altKey) &&
    (!requiredModifiers.includes("Shift") || event.shiftKey) &&
    (!requiredModifiers.includes("Meta") || event.metaKey)
  );
}

/**
 * Formats a KeyCommand into a human-readable string.
 * @param cmd - The KeyCommand to format.
 * @returns A formatted string representing the key command.
 */
export function formatKeyCommand(cmd: KeyCommand): string {
  const modifierMap: Record<string, string> = {
    Meta: "Cmd",
    Shift: "Shift",
    Alt: "Alt",
    Ctrl: "Ctrl",
  };

  const parts = cmd.modifiers.map((m) => modifierMap[m] || m);
  let keyDisplay: string = cmd.key;

  if (keyDisplay === " ") keyDisplay = "Space";
  else if (keyDisplay === "ArrowUp") keyDisplay = "Up";
  else if (keyDisplay === "ArrowDown") keyDisplay = "Down";
  else if (keyDisplay === "ArrowLeft") keyDisplay = "Left";
  else if (keyDisplay === "ArrowRight") keyDisplay = "Right";
  else if (keyDisplay.length === 1) keyDisplay = keyDisplay.toUpperCase();

  parts.push(keyDisplay);

  return parts.join("+");
}

/**
 * Formats a keyboard shortcut into a human-readable string.
 * @param commandId - The command ID for which to format the shortcut.
 * @returns A formatted string representing the shortcut.
 */
export function formatShortcut(
  commandId: CommandId | null | undefined,
): string {
  if (!commandId) return "";
  const cmd = keyCommands.find((c) => c.id === commandId);
  if (!cmd) return "";

  return formatKeyCommand(cmd);
}
