import { useState, useMemo, useEffect, useRef } from "react";

interface UseTablePaginationOptions<T> {
  items: T[];
  initialPage?: number;
  initialPageSize?: number;
}

/**
 * Manages pagination state for a table.
 * @param items - The full list of items to paginate
 * @param initialPageSize - Initial number of items per page
 * @returns
 */
export function useTablePagination<T>({
  items,
  initialPage = 1,
  initialPageSize = 20,
}: UseTablePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalCount = items.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [totalCount, pageSize]
  );

  // Adjust currentPage if items or pageSize change
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage((prev) => {
      const newTotalPages = Math.max(1, Math.ceil(items.length / pageSize));
      if (prev > newTotalPages) return 1;
      if (prev < 1) return 1;
      return prev;
    });
  }, [items, pageSize]);

  // Clamp currentPage within valid range when totalPages changes
  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [totalPages]);

  const paginatedItems = useMemo(
    () =>
      items.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      ),
    [items, currentPage, pageSize]
  );

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedItems,
    totalCount,
  };
}
