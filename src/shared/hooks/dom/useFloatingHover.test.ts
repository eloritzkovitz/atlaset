import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFloatingHover } from "./useFloatingHover";

describe("useFloatingHover", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it("should always show floating when useFloatingHover is false", () => {
    let hook: any;
    act(() => {
      hook = renderHook(() => useFloatingHover(false));
    });
    const { result } = hook;
    expect(result.current.shouldShowFloating).toBe(true);

    // Handlers should be empty objects
    expect(result.current.hoverHandlers).toEqual({});
    expect(result.current.floatingHandlers).toEqual({});
  });

  it('should show floating when hovering trigger or menu in "menu" mode', () => {
    let hook: any;
    act(() => {
      hook = renderHook(() => useFloatingHover(true, 150, "menu"));
    });
    const { result } = hook;
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on trigger
    act(() => {
      result.current.hoverHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    // Simulate mouse leave from trigger
    act(() => {
      result.current.hoverHandlers.onMouseLeave?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on floating menu
    act(() => {
      result.current.floatingHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    // Simulate mouse leave from floating menu
    act(() => {
      result.current.floatingHandlers.onMouseLeave?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.shouldShowFloating).toBe(false);
  });

  it('should show floating only when hovering trigger in "button" mode', () => {
    let hook: any;
    act(() => {
      hook = renderHook(() => useFloatingHover(true, 150, "button"));
    });
    const { result } = hook;
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on trigger
    act(() => {
      result.current.hoverHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    // Simulate mouse leave from trigger
    act(() => {
      result.current.hoverHandlers.onMouseLeave?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on floating button (should not show in "button" mode)
    act(() => {
      result.current.floatingHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate mouse leave from floating button
    act(() => {
      result.current.floatingHandlers.onMouseLeave?.();
    });
    expect(result.current.shouldShowFloating).toBe(false);
  });
});
