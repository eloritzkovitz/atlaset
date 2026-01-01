import { renderHook, act } from "@testing-library/react";
import { useSort } from "./useSort";

type Item = { name: string; age: number };
type SortKey = "name" | "age";

const items: Item[] = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Carol", age: 35 },
];

const sorter = (items: Item[], sortBy: SortKey) =>
  [...items].sort((a, b) =>
    sortBy === "name" ? a.name.localeCompare(b.name) : a.age - b.age
  );

describe("useSort", () => {
  it("returns items sorted by initialSort", () => {
    const { result } = renderHook(() =>
      useSort(items, sorter, "name" as SortKey)
    );
    expect(result.current.sortedItems.map((i) => i.name)).toEqual([
      "Alice",
      "Bob",
      "Carol",
    ]);
  });

  it("changes sort key and resorts items", () => {
    const { result } = renderHook(() =>
      useSort(items, sorter, "name" as SortKey)
    );
    act(() => {
      return result.current.setSortBy("age" as SortKey);
    });
    expect(result.current.sortedItems.map((i) => i.age)).toEqual([25, 30, 35]);
  });

  it("memoizes sorted items unless items or sortBy changes", () => {
    const sorterSpy = vi.fn(sorter);
    const { result, rerender } = renderHook(
      ({ items, sortBy }) => useSort(items, sorterSpy, sortBy),
      { initialProps: { items, sortBy: "name" as SortKey } }
    );
    expect(sorterSpy).toHaveBeenCalledTimes(1);

    // Rerender with same items and sortBy
    rerender({ items, sortBy: "name" });
    expect(sorterSpy).toHaveBeenCalledTimes(1);

    // Change sortBy
    act(() => {
      result.current.setSortBy("age");
    });
    expect(sorterSpy).toHaveBeenCalledTimes(2);
  });
});
