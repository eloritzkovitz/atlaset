/**
 * Utility functions for interacting with the browser's localStorage.
 */

/**
 * Retrieves a cached value from localStorage, or returns a fallback value if the key does not exist or if an error occurs.
 * @param key - The key under which the value is stored in localStorage.
 * @param fallback - The value to return if the key does not exist or if an error occurs.
 * @returns The cached value parsed from JSON, or the fallback value.
 */
export function getCachedValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn(`Failed to retrieve cache for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Stores a value in localStorage under the specified key, serialized as JSON.
 * @param key - The key under which to store the value in localStorage.
 * @param value - The value to store, which will be serialized to JSON. *
 */
export function setCachedValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to update cache for key "${key}":`, error);
  }
}

/**
 * Removes a cached value from localStorage for the specified key.
 * @param key - The key of the value to remove from localStorage.
 */
export function removeCachedValue(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove cache for key "${key}":`, error);
  }
}
