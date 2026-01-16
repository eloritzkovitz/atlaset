import { renderHook, act } from "@testing-library/react";
import { useTablePagination } from "./useTablePagination";

describe("useTablePagination", () => {
  const makeItems = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

  it("returns correct initial page and page size", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: makeItems(50),
        initialPage: 2,
        initialPageSize: 10,
      })
    );
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(10);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.paginatedItems).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
  });

  it("clamps currentPage if out of bounds after items change", () => {
    const { result, rerender } = renderHook(
      ({ items }) =>
        useTablePagination({ items, initialPage: 3, initialPageSize: 10 }),
      { initialProps: { items: makeItems(30) } }
    );
    act(() => {
      result.current.setCurrentPage(4);
    });
    expect(result.current.currentPage).toBe(4);
    rerender({ items: makeItems(25) });
    // Now only 3 pages, should clamp to 1
    expect(result.current.currentPage).toBe(1);
  });

  it("updates paginatedItems when page or pageSize changes", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: makeItems(30),
        initialPage: 1,
        initialPageSize: 10,
      })
    );
    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.paginatedItems).toEqual([
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ]);
    act(() => {
      result.current.setPageSize(5);
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems).toEqual([6, 7, 8, 9, 10]);
  });

  it("returns totalCount and totalPages correctly", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: makeItems(23),
        initialPage: 1,
        initialPageSize: 10,
      })
    );
    expect(result.current.totalCount).toBe(23);
    expect(result.current.totalPages).toBe(3);
  });

  it("resets currentPage to 1 if set to out of bounds value or totalPages decreases", () => {
    const { result, rerender } = renderHook(() =>
      useTablePagination({
        items: makeItems(30),
        initialPage: 3,
        initialPageSize: 10,
      })
    );
    act(() => {
      result.current.setCurrentPage(5);
    });
    expect(result.current.currentPage).toBe(1); // Should reset to 1 (out of bounds)
    // Remove items so only 2 pages remain
    rerender({ items: makeItems(15) });
    expect(result.current.currentPage).toBe(1); // Should stay at 1
  });

  it("clamps currentPage to 1 if set to < 1", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: makeItems(10),
        initialPage: 1,
        initialPageSize: 5,
      })
    );
    act(() => {
      result.current.setCurrentPage(-5);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("resets currentPage to 1 if set to > totalPages", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: makeItems(10),
        initialPage: 1,
        initialPageSize: 5,
      })
    );
    act(() => {
      result.current.setCurrentPage(10);
    });
    expect(result.current.currentPage).toBe(1);
  });
});
