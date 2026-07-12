import { useState, useEffect, useMemo, useRef } from "react";

interface IncrementalListOptions {
  initialBatchSize?: number;
  loadBatchSize?: number;
}

/**
 * Provides incremental loading of a list of items, useful for lazy streaming large datasets in the UI.
 * @param sourceList - The full list of items to be incrementally loaded.
 * @param options - Optional configuration for initial and subsequent batch sizes.
 * @returns An array of currently visible items based on the incremental loading logic.
 */
export function useIncrementalList<T>(
  sourceList: T[],
  { initialBatchSize = 12, loadBatchSize = 24 }: IncrementalListOptions = {},
) {
  const [visibleCount, setVisibleCount] = useState(initialBatchSize);
  const targetLengthRef = useRef(sourceList.length);
  targetLengthRef.current = sourceList.length;

  // Stream loop only listens to changes in total length or visible increments
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const streamNextBatch = () => {
      setVisibleCount((currentVisible) => {
        if (currentVisible >= targetLengthRef.current) return currentVisible;
        timeoutId = setTimeout(streamNextBatch, 0);
        return Math.min(
          currentVisible + loadBatchSize,
          targetLengthRef.current,
        );
      });
    };

    if (visibleCount < sourceList.length) {
      timeoutId = setTimeout(streamNextBatch, 0);
    }

    return () => clearTimeout(timeoutId);
  }, [visibleCount, loadBatchSize, sourceList.length]);

  return useMemo(
    () => sourceList.slice(0, visibleCount),
    [sourceList, visibleCount],
  );
}
