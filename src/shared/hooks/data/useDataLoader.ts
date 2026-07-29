import { useState, useRef, useCallback } from "react";

interface UseDataLoaderOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (err: Error) => void;
}

/**
 * Manages data fetching, loading state, and error handling for a given fetch function.
 * @param - fetchFn: The asynchronous function to fetch data.
 * @param - onSuccess: Optional callback invoked with the fetched data on success.
 * @param - onError: Optional callback invoked with the error object on failure.
 * @returns An object containing the fetched data, loading state, error state, and a reload function.
 */
export function useDataLoader<T>({
  fetchFn,
  onSuccess,
  onError,
}: UseDataLoaderOptions<T>) {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasInitialLoaded = useRef(false);

  // Sets the data state and marks loading as false
  const setData = useCallback((value: React.SetStateAction<T | null>) => {
    setDataState(value);
    setLoading(false);
  }, []);

  // Reloads the data by calling the fetch function and updating state accordingly
  const reload = useCallback(async () => {
    if (!hasInitialLoaded.current) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchFn();
      setDataState(result);
      if (onSuccess) onSuccess(result);
      hasInitialLoaded.current = true;
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      if (onError) onError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError]);

  return { data, setData, loading, error, reload };
}
