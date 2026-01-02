import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
import { useDragReorder } from "./useDragReorder";

describe("useDragReorder", () => {
  function useItemsAndDragReorder(initialItems: string[]) {
    const [items, setItems] = useState(initialItems);
    const drag = useDragReorder(items, setItems);
    return { ...drag, items };
  }

  it("sets draggedIndex on drag start", () => {
    const { result } = renderHook(() =>
      useItemsAndDragReorder(["a", "b", "c"])
    );
    expect(result.current.draggedIndex).toBe(null);
    act(() => {
      result.current.handleDragStart(1);
    });
    expect(result.current.draggedIndex).toBe(1);
  });

  it("reorders items on drag over", () => {
    const { result } = renderHook(() =>
      useItemsAndDragReorder(["a", "b", "c"])
    );
    act(() => {
      result.current.handleDragStart(0); // drag "a"
    });
    const fakeEvent = {
      preventDefault: () => {},
    } as React.DragEvent<HTMLLIElement>;
    act(() => {
      result.current.handleDragOver(fakeEvent, 2); // drop at index 2
    });
    expect(result.current.items).toEqual(["b", "c", "a"]);
  });

  it("does not reorder if draggedIndex is null", () => {
    const { result } = renderHook(() =>
      useItemsAndDragReorder(["a", "b", "c"])
    );
    const fakeEvent = {
      preventDefault: () => {},
    } as React.DragEvent<HTMLLIElement>;
    act(() => {
      result.current.handleDragOver(fakeEvent, 1);
    });
    expect(result.current.items).toEqual(["a", "b", "c"]);
  });

  it("does not reorder if draggedIndex equals target index", () => {
    const { result } = renderHook(() =>
      useItemsAndDragReorder(["a", "b", "c"])
    );
    act(() => {
      result.current.handleDragStart(1);
    });
    const fakeEvent = {
      preventDefault: () => {},
    } as React.DragEvent<HTMLLIElement>;
    act(() => {
      result.current.handleDragOver(fakeEvent, 1);
    });
    expect(result.current.items).toEqual(["a", "b", "c"]);
  });

  it("resets draggedIndex on drag end", () => {
    const { result } = renderHook(() =>
      useItemsAndDragReorder(["a", "b", "c"])
    );
    act(() => {
      result.current.handleDragStart(1);
    });
    expect(result.current.draggedIndex).toBe(1);
    act(() => {
      result.current.handleDragEnd();
    });
    expect(result.current.draggedIndex).toBe(null);
  });
});
