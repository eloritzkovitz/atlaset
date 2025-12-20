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
export function usePagination<T = any>(options: UsePaginationOptions<T>) {
  const pageSize = options.pageSize ?? 20;

  const [page, setPage] = useState(1);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Initialize pagination on items change
  useEffect(() => {
    setPage(1);
    setHasMore(options.items.length > pageSize);
    setData(options.items.slice(0, pageSize));
  }, [options.items, pageSize]);

  // Load more data
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const paginated = options.items.slice(0, nextPage * pageSize);
    setData(paginated);
    setPage(nextPage);
    setHasMore(paginated.length < options.items.length);
  }, [options.items, page, pageSize]);

  return {
    data,
    hasMore,
    loadMore,
    page,
  };
}
