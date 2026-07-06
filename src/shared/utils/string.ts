/**
 * Utility functions for string manipulation.
 */

import { keyCommands } from "@constants/keyCommands";
import type { CommandId, KeyCommand } from "@types";

/**
 * Capitalizes the first letter of a string.
 * @param str - The input string.
 * @returns The string with the first letter capitalized.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Capitalizes the first letter of each word in a string.
 * @param str - The input string.
 * @returns The string with each word capitalized.
 */
export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Gets the appropriate article (a/an) for a given word.
 * @param word - The word for which to get the article.
 * @returns The article ("a" or "an").
 */
export function getArticle(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

/**
 * Pluralizes a label based on the count.
 * @param label - The label to pluralize
 * @param count - The count determining singular/plural
 * @returns - The pluralized label
 */
export function pluralize(label: string, count: number) {
  return count === 1 ? label : label + "s";
}

/**
 * Truncates a string to a specified maximum length, adding an ellipsis if truncated.
 * @param str - The input string.
 * @param maxLength - The maximum allowed length of the string.
 * @returns The truncated string.
 */
export function truncate(str: string, maxLength: number) {
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}

/**
 * Normalizes a string by removing diacritics and converting to lowercase.
 * @param str - The input string to normalize.
 * @returns The normalized string.
 */
export function normalizeString(str: string) {
  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase();
}

/**
 * Converts a string into a URL-friendly slug.
 * @param str - The input string to slugify.
 * @returns The slugified string.
 */
export function slugify(str: string) {
  return normalizeString(str)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Converts a string into a canonical key used for locale lookups.
 * @param str - The input string to convert.
 * @returns The canonical key string.
 */
export function canonicalKey(str: string) {
  return slugify(str).replace(/-/g, "_");
}

/**
 * Returns true when the provided value is a numeric string (integer),
 * optionally signed. Examples: "123", "-99".
 * @param s - value to test
 */
export function isNumericString(s?: string | null) {
  return typeof s === "string" && /^-?\d+$/.test(s);
}

/**
 * Type guard to check if props has string children.
 * @param props - The props to check.
 * @returns Whether the props has string children.
 */
export function hasStringChildren(
  props: unknown,
): props is { children: string } {
  return (
    typeof props === "object" &&
    props !== null &&
    "children" in props &&
    typeof (props as { children: unknown }).children === "string"
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
