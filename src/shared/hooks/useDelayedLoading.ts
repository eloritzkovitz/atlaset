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
  deps: any[] = [],
  minDelay = 300
) {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowLoading(false), minDelay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [loading, minDelay, ...deps]);

  return loading || showLoading;
}
