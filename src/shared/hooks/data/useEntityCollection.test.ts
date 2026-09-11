import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEntityCollection, type Entity } from "./useEntityCollection";

interface TestEntity extends Entity {
  name: string;
}

const item1: TestEntity = { id: "1", name: "Item 1" };
const item2: TestEntity = { id: "2", name: "Item 2" };

describe("useEntityCollection", () => {
  const persistItems = vi.fn().mockResolvedValue(undefined);
  const onLogAction = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes and syncs items", () => {
    const { result, rerender } = renderHook(
      ({ items }) =>
        useEntityCollection({
          initialItems: items,
          persistItems,
          onLogAction,
        }),
      { initialProps: { items: [item1] } },
    );

    expect(result.current.items).toEqual([item1]);

    rerender({ items: [item2] });

    expect(result.current.items).toEqual([item2]);
  });

  it("handles collection mutations", async () => {
    const { result } = renderHook(() =>
      useEntityCollection({
        initialItems: [item1],
        persistItems,
        onLogAction,
      }),
    );

    await act(() => result.current.addItem(item2));

    const added = { ...item2, order: 1 };
    expect(result.current.items).toEqual([item1, added]);
    expect(onLogAction).toHaveBeenLastCalledWith("add", added);

    const updated = { ...item1, name: "Updated" };

    await act(() => result.current.updateItem(updated));
    expect(result.current.items).toEqual([updated, added]);

    await act(() => result.current.reorderItems([added, updated]));

    const reordered = [
      { ...added, order: 0 },
      { ...updated, order: 1 },
    ];

    expect(result.current.items).toEqual(reordered);
    expect(onLogAction).toHaveBeenLastCalledWith("reorder", reordered[0]);

    await act(() => result.current.updateItemName("1", "Renamed"));

    expect(result.current.items).toEqual([
      reordered[0],
      { ...reordered[1], name: "Renamed" },
    ]);

    await act(() => result.current.toggleItemVisibility("1"));

    expect(result.current.items).toEqual([
      reordered[0],
      { ...reordered[1], name: "Renamed", visible: true },
    ]);

    await act(() => result.current.removeItem("2"));

    expect(result.current.items).toEqual([
      { ...reordered[1], name: "Renamed", visible: true },
    ]);
  });

  it("handles missing items and empty reorder", async () => {
    const { result } = renderHook(() =>
      useEntityCollection({
        initialItems: [item1],
        persistItems,
        onLogAction,
      }),
    );

    await act(() => result.current.removeItem("missing"));
    await act(() => result.current.updateItemName("missing", "Missing"));
    await act(() => result.current.toggleItemVisibility("missing"));
    await act(() => result.current.reorderItems([]));

    expect(result.current.items).toEqual([]);
    expect(persistItems).toHaveBeenCalledWith([]);
    expect(onLogAction).not.toHaveBeenCalled();
  });

  it("works without action logging", async () => {
    const { result } = renderHook(() =>
      useEntityCollection({
        initialItems: [item1],
        persistItems,
      }),
    );

    await act(() => result.current.addItem(item2));
    await act(() => result.current.updateItem({ ...item1, name: "Updated" }));
    await act(() => result.current.reorderItems([item2, item1]));
    await act(() => result.current.removeItem("2"));

    expect(persistItems).toHaveBeenCalledTimes(4);
  });
});
