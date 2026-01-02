import { useEffect, useState } from "react";

/**
 * Manages a delayed loading state to prevent flickering.
 * @param loading - Current loading state
 * @param deps - Dependencies that trigger the effect
 * @param minDelay - Minimum delay in milliseconds before setting loading to false
 * @returns The delayed loading state
 */
export function useDelayedLoading(
  loading: boolean,
  deps: unknown[] = [],
  minDelay = 300
) {
  const [showLoading, setShowLoading] = useState(true);

  // Handle delayed loading effect
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), minDelay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, minDelay, ...deps]);

  return loading || showLoading;
}
