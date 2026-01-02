import { useEffect, useState } from "react";

/**
 * Debounces a value by the specified delay.
 * @param value - The value to debounce
 * @param delay = 300 Delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  // Update debounced value after delay
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
