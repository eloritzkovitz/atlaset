/**
 * Utility functions related to environment checks and global objects.
 */

/** Checks if the window object is defined for SSR-safe usage. */
export function isWindowDefined() {
  return typeof window !== "undefined";
}
