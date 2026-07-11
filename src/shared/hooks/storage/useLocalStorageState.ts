import { useState, useCallback } from "react";

/**
 * Manages state that is persisted in localStorage.
 * @param key - The key under which the value is stored in localStorage.
 * @param defaultValue - The default value to use if no value is found in localStorage.
 * @returns A tuple containing the current state value and a function to update it.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (val: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  /** Updates the state and persists the value to localStorage. */
  const setPersistentState = useCallback(
    (value: T) => {
      setState(value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  return [state, setPersistentState];
}
