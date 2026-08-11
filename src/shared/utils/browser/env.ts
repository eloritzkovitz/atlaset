/**
 * Utility functions related to environment checks and global objects.
 */

/** Checks if the window object is defined for SSR-safe usage. */
export function isWindowDefined() {
  return typeof window !== "undefined";
}

/**
 * Checks if the current environment is a localhost environment.
 * @param target - Optional hostname to check. If not provided, uses the current window's hostname.
 * @returns - True if running on localhost, false otherwise.
 */
export function isLocalhost(target?: string): boolean {
  let hostname = target;

  if (hostname === undefined) {
    if (typeof window === "undefined") return false;
    hostname = window.location.hostname;
  }

  const clean = hostname.toLowerCase().trim();

  return (
    clean === "localhost" ||
    clean === "127.0.0.1" ||
    clean === "[::1]" ||
    clean === "::1" ||
    clean.endsWith(".local") ||
    clean.startsWith("192.168.") ||
    clean.startsWith("10.")
  );
}
