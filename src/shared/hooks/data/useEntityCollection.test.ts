import { act, cleanup, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type Mock,
} from "vitest";
import {
  useEntityCollection,
  type UseEntityCollectionOptions,
} from "./useEntityCollection";

interface TestEntity {
  id: string;
  name: string;
}

const item1: TestEntity = { id: "1", name: "Item 1" };
const item2: TestEntity = { id: "2", name: "Item 2" };

describe("useEntityCollection", () => {
  let persistItems: Mock<
    UseEntityCollectionOptions<TestEntity>["persistItems"]
  >;
  let onLogAction: Mock<
    NonNullable<UseEntityCollectionOptions<TestEntity>["onLogAction"]>
  >;

  beforeEach(() => {
    persistItems = vi.fn().mockResolvedValue(undefined);
    onLogAction = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("initializes items and handles prop sync", () => {
    const { result, rerender } = renderHook(
      ({ items }) =>
        useEntityCollection({ initialItems: items, persistItems, onLogAction }),
      { initialProps: { items: [item1] } },
    );

    expect(result.current.items).toEqual([item1]);

    rerender({ items: [item2] });
    expect(result.current.items).toEqual([item2]);
  });

  test("handles item mutations (add, update, reorder, rename, toggle visibility, remove)", async () => {
    const { result } = renderHook(() =>
      useEntityCollection({ initialItems: [item1], persistItems, onLogAction }),
    );

    await act(async () => {
      await result.current.addItem(item2);
    });
    expect(result.current.items).toEqual([item1, item2]);
    expect(onLogAction).toHaveBeenLastCalledWith("add", item2);
    expect(persistItems).toHaveBeenLastCalledWith([item1, item2]);

    const updated = { id: "1", name: "Updated 1" };
    await act(async () => {
      await result.current.updateItem(updated);
    });
    expect(result.current.items).toEqual([updated, item2]);
    expect(onLogAction).toHaveBeenLastCalledWith("edit", updated);

    await act(async () => {
      await result.current.reorderItems([item2, updated]);
    });
    expect(result.current.items).toEqual([item2, updated]);
    expect(onLogAction).toHaveBeenLastCalledWith("reorder", item2);

    await act(async () => {
      await result.current.updateItemName("1", "Renamed 1");
    });
    expect(result.current.items).toEqual([
      item2,
      { ...updated, name: "Renamed 1" },
    ]);
    expect(onLogAction).toHaveBeenLastCalledWith("edit", {
      ...updated,
      name: "Renamed 1",
    });

    await act(async () => {
      await result.current.toggleItemVisibility("1");
    });
    expect(result.current.items).toEqual([
      item2,
      { ...updated, name: "Renamed 1", visible: true },
    ]);
    expect(onLogAction).toHaveBeenLastCalledWith("edit", {
      ...updated,
      name: "Renamed 1",
      visible: true,
    });

    await act(async () => {
      await result.current.removeItem("missing_id");
    });
    expect(result.current.items).toEqual([
      item2,
      { ...updated, name: "Renamed 1", visible: true },
    ]);

    await act(async () => {
      await result.current.removeItem("2");
    });
    expect(result.current.items).toEqual([
      { ...updated, name: "Renamed 1", visible: true },
    ]);
    expect(onLogAction).toHaveBeenLastCalledWith("remove", item2);
  });

  test("supports operating without onLogAction callback", async () => {
    const { result } = renderHook(() =>
      useEntityCollection({ initialItems: [item1], persistItems }),
    );

    await act(async () => {
      await result.current.addItem(item2);
      await result.current.updateItem({ id: "1", name: "No Log" });
      await result.current.reorderItems([item2, item1]);
      await result.current.removeItem("2");
    });

    expect(persistItems).toHaveBeenCalledTimes(4);
  });
});
