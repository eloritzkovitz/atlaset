/**
 * Utility functions for handling usernames.
 */

import { Filter } from "bad-words";
import forbiddenUsernames from "../constants/forbiddenUsernames.json";

// 3-20 chars, alphanumeric/underscores/hyphens, cannot start/end with special chars, no consecutive special chars
const USERNAME_PATTERN = /^(?![_-])(?!.*[_-]{2})[a-zA-Z0-9_-]{3,20}(?<![_-])$/;
const filter = new Filter();

/**
 * Checks if a username meets format, profanity, and blocklist rules.
 * @param username - The username to validate.
 * @returns True if the username is valid, false otherwise.
 */
export function isUsernameFormatValid(username: string): boolean {
  if (!USERNAME_PATTERN.test(username)) return false;

  // Check against forbidden usernames (case-insensitive)
  const normalized = username.toLowerCase();
  if (forbiddenUsernames.includes(normalized)) return false;

  // Check for profane words in the username
  if (filter.isProfane(username)) return false;

  // Check for profane words after replacing special characters with spaces
  const spacedOut = normalized.replace(/[_0-9-]+/g, " ");
  if (filter.isProfane(spacedOut)) return false;

  return true;
}
