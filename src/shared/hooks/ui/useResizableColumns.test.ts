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
      useResizableColumns<ColKey>(defaultWidths, minWidths),
    );
    expect(result.current.colWidths).toEqual(defaultWidths);
  });

  it("resizes a column on mouse move", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths),
    );

    // Simulate mouse down on column "a"
    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a",
      );
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 130 }));
    });

    expect(result.current.colWidths.a).toBe(130);
  });

  it("does not resize below min width", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths),
    );

    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a",
      );
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 0 }));
    });

    expect(result.current.colWidths.a).toBe(50);
  });

  it("does nothing on mouse move if not resizing", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths),
    );

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 150 }));
    });

    expect(result.current.colWidths).toEqual(defaultWidths);
  });

  it("resets resizing state on mouse up", () => {
    const { result } = renderHook(() =>
      useResizableColumns<ColKey>(defaultWidths, minWidths),
    );

    act(() => {
      result.current.handleResizeStart(
        { clientX: 100 } as React.MouseEvent,
        "a",
      );
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 200 }));
    });

    expect(result.current.colWidths.a).toBe(100);
  });
});
