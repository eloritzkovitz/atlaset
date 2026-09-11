import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export interface UseQueryParamOptions {
  replace?: boolean;
}

/**
 * Synchronizes a specific query parameter in the URL with a state variable.
 * @param key - The name of the query parameter to synchronize with.
 * @param defaultValue - The value that, when matched, will cause the query parameter to be removed from the URL entirely.
 * @param options - Additional options for configuring the behavior of the hook.
 * @returns A tuple containing the current value of the query parameter and a setter function to update it.
 */
export function useQueryParam<T extends string>(
  key: string,
  defaultValue: NoInfer<T>,
  options: UseQueryParamOptions = {},
): [T, (newValue: T) => void] {
  const { replace = true } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = (searchParams.get(key) ?? defaultValue) as T;

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (newValue === defaultValue) {
            next.delete(key);
          } else {
            next.set(key, newValue);
          }

          return next;
        },
        { replace },
      );
    },
    [key, defaultValue, replace, setSearchParams],
  );

  return [currentValue, setValue];
}
