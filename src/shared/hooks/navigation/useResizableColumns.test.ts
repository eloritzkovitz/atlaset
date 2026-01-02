import { renderHook, act } from "@testing-library/react";
import { useResizableColumns } from "./useResizableColumns";

type ColKey = "a" | "b";

describe("useResizableColumns", () => {
  const defaultWidths = { a: 100, b: 200 };
  const minWidths = { a: 50, b: 100 };

  beforeEach(() => {
    // Reset any event listeners
    vi.restoreAllMocks();
  });

  it("returns initial column widths", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths)
    );
    expect(result.current.colWidths).toEqual(defaultWidths);
  });

  it("resizes a column on mouse move", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths)
    );

    // Simulate mouse down on column "a"
    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a"
      );
    });

    // Simulate mouse move (drag to the right by 30px)
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 130 }));
    });

    expect(result.current.colWidths.a).toBe(130); // 100 + 30
  });

  it("does not resize below min width", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths)
    );

    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a"
      );
    });

    // Simulate mouse move to the left by 100px (would make width 0, but min is 50)
    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 0 }));
    });

    expect(result.current.colWidths.a).toBe(50); // min width
  });

  it("cleans up event listeners on mouse up", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths)
    );

    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a"
      );
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function)
    );
  });

  it("does nothing on mouse move if not resizing", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths)
    );

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 150 }));
    });

    // Should remain unchanged
    expect(result.current.colWidths).toEqual(defaultWidths);
  });
});
