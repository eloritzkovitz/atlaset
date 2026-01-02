import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1); // [1..50]

  it("returns first page of data by default", () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 10 }));
    expect(result.current.data).toEqual(items.slice(0, 10));
    expect(result.current.hasMore).toBe(true);
    expect(result.current.page).toBe(1);
  });

  it("loads more data when loadMore is called", () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 10 }));
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.data).toEqual(items.slice(0, 20));
    expect(result.current.hasMore).toBe(true);
    expect(result.current.page).toBe(2);
  });

  it("hasMore is false when all data is loaded", () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 25 }));
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.data).toEqual(items);
    expect(result.current.hasMore).toBe(false);
  });

  it("resets page when items change", () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination({ items, pageSize: 10 }),
      { initialProps: { items } }
    );
    act(() => {
      result.current.loadMore();
    });
    expect(result.current.page).toBe(2);
    rerender({ items: items.slice(0, 20) });
    expect(result.current.page).toBe(1);
    expect(result.current.data).toEqual(items.slice(0, 10));
  });
});
