import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useViewMode } from "./useViewMode";

describe("useViewMode", () => {
  it("should initialize with default 'grid' layout", () => {
    const { result } = renderHook(() => useViewMode());

    expect(result.current.viewMode).toBe("grid");
    expect(result.current.isGridView).toBe(true);
    expect(result.current.isListView).toBe(false);
  });

  it("should honor an explicit initial view mode", () => {
    const { result } = renderHook(() => useViewMode("list"));

    expect(result.current.viewMode).toBe("list");
    expect(result.current.isGridView).toBe(false);
    expect(result.current.isListView).toBe(true);
  });

  it("should toggle back and forth between layouts", () => {
    const { result } = renderHook(() => useViewMode("grid"));

    act(() => {
      result.current.toggleViewMode();
    });
    expect(result.current.viewMode).toBe("list");
    expect(result.current.isListView).toBe(true);

    act(() => {
      result.current.toggleViewMode();
    });
    expect(result.current.viewMode).toBe("grid");
    expect(result.current.isGridView).toBe(true);
  });

  it("should allow setting the view mode directly", () => {
    const { result } = renderHook(() => useViewMode("grid"));

    act(() => {
      result.current.setViewMode("list");
    });
    expect(result.current.viewMode).toBe("list");
  });
});
