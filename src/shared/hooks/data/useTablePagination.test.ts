import { renderHook, act } from "@testing-library/react";
import { useTablePagination } from "./useTablePagination";

describe("useTablePagination", () => {
  const items = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

  type Props = { data: number[] };

  it("handles pagination and clamping", () => {
    const { result, rerender } = renderHook(
      ({ data }: Props) =>
        useTablePagination({
          items: data,
          initialPage: 2,
          initialPageSize: 10,
        }),
      { initialProps: { data: items(30) } },
    );

    expect(result.current.totalPages).toBe(3);

    act(() => result.current.setCurrentPage(0));
    act(() => result.current.setPageSize(5));
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.setCurrentPage(10));
    act(() => result.current.setPageSize(20));
    expect(result.current.currentPage).toBe(1);

    act(() => result.current.setCurrentPage(2));
    rerender({ data: items(15) });
    expect(result.current.currentPage).toBe(1);
  });

  it("returns correct pagination", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: items(23),
        initialPage: 2,
        initialPageSize: 10,
      }),
    );

    expect(result.current.totalCount).toBe(23);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedItems).toEqual(items(23).slice(10, 20));
  });

  it("keeps currentPage when it remains valid", () => {
    const { result } = renderHook(() =>
      useTablePagination({
        items: items(30),
        initialPage: 2,
        initialPageSize: 10,
      }),
    );

    act(() => result.current.setPageSize(5));

    expect(result.current.currentPage).toBe(2);
  });
});
