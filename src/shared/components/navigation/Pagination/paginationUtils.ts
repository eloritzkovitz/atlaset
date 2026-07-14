/**
 * Utility functions for managing Pagination.
 */

/**
 * Returns an array of page numbers and ellipsis ("...") for compact pagination UI.
 * @param currentPage The current active page (1-based)
 * @param totalPages The total number of pages
 */
export function getPageButtons(
  currentPage: number,
  totalPages: number,
): (number | string)[] {
  const windowSize = 2;
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (currentPage > windowSize + 2) pages.push("...");
  for (
    let i = Math.max(2, currentPage - windowSize);
    i <= Math.min(totalPages - 1, currentPage + windowSize);
    i++
  ) {
    pages.push(i);
  }
  if (currentPage < totalPages - windowSize - 1) pages.push("...");
  pages.push(totalPages);
  return pages;
}
