import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1);

  it("returns the first page with default page size", () => {
    const { result } = renderHook(() => usePagination({ items }));

    expect(result.current.data).toEqual(items.slice(0, 20));
    expect(result.current.hasMore).toBe(true);
    expect(result.current.page).toBe(1);
  });

  it("loads more data", () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 10 }));

    act(() => result.current.loadMore());

    expect(result.current.data).toEqual(items.slice(0, 20));
    expect(result.current.page).toBe(2);
  });

  it("sets hasMore false when all data is loaded", () => {
    const { result } = renderHook(() => usePagination({ items, pageSize: 25 }));

    act(() => result.current.loadMore());

    expect(result.current.data).toEqual(items);
    expect(result.current.hasMore).toBe(false);
  });

  it("resets when items change", () => {
    const { result, rerender } = renderHook(
      ({ items }: { items: number[] }) =>
        usePagination({ items, pageSize: 10 }),
      { initialProps: { items } },
    );

    act(() => result.current.loadMore());
    rerender({ items: items.slice(0, 20) });

    expect(result.current.page).toBe(1);
    expect(result.current.data).toEqual(items.slice(0, 10));
  });
});
