import { useState, useEffect, useCallback } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  pageSize?: number;
}

/**
 * Paginates data from a local array.
 * @param options - Configuration options for pagination.
 * @returns An object containing paginated data, loading state, pagination info, and a function to load more data.
 */
export function usePagination<T>(options: UsePaginationOptions<T>) {
  const pageSize = options.pageSize ?? 20;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const loading = false;

  // Reset page when items or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [options.items, pageSize]);

  // Update data and hasMore when page, items, or pageSize changes
  useEffect(() => {
    const paginated = options.items.slice(0, page * pageSize);
    setData(paginated);
    setHasMore(paginated.length < options.items.length);
  }, [options.items, page, pageSize]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  return { data, loading, hasMore, loadMore, page };
}
