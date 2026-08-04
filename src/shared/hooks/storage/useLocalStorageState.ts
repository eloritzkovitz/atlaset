import { useState, useCallback } from "react";
import { getCachedValue, setCachedValue } from "@utils";

/**
 * Manages state that is persisted in localStorage.
 * @param key - The key under which the value is stored in localStorage.
 * @param defaultValue - The default value to use if no value is found in localStorage.
 * @returns A tuple containing the current state value and a function to update it.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, (val: T | ((prevState: T) => T)) => void] {
  const [state, setState] = useState<T>(() =>
    getCachedValue<T>(key, defaultValue),
  );

  /** Updates the state and persists the value to localStorage. */
  const setPersistentState = useCallback(
    (value: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const nextState =
          typeof value === "function"
            ? (value as (prevState: T) => T)(prevState)
            : value;

        setCachedValue(key, nextState);
        return nextState;
      });
    },
    [key],
  );

  return [state, setPersistentState];
}
