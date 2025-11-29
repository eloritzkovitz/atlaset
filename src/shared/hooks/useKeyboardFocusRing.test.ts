import { renderHook, act } from "@testing-library/react";
import { useKeyboardFocusRing } from "./useKeyboardFocusRing";

describe("useKeyboardFocusRing", () => {
  beforeEach(() => {
    // Ensure no lingering listeners between tests
    document.body.focus();
  });

  it("should return false by default", () => {
    const { result } = renderHook(() => useKeyboardFocusRing());
    expect(result.current).toBe(false);
  });

  it("should return true after Tab keydown", () => {
    const { result } = renderHook(() => useKeyboardFocusRing());
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    });
    expect(result.current).toBe(true);
  });

  it("should return false after mousedown", () => {
    const { result } = renderHook(() => useKeyboardFocusRing());
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    });
    expect(result.current).toBe(true);
    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown"));
    });
    expect(result.current).toBe(false);
  });

  it("should not set showRing to true for non-Tab keys", () => {
    const { result } = renderHook(() => useKeyboardFocusRing());
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
    expect(result.current).toBe(false);
  });
});
