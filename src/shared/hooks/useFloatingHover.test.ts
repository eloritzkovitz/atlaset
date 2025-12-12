import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useFloatingHover } from "./useFloatingHover";

describe("useFloatingHover", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should always show floating when useFloatingHover is false", () => {
    const { result } = renderHook(() => useFloatingHover(false));
    expect(result.current.shouldShowFloating).toBe(true);

    // Handlers should be empty objects
    expect(result.current.hoverHandlers).toEqual({});
    expect(result.current.floatingHandlers).toEqual({});
  });

  it("should show floating only on hover when useFloatingHover is true", () => {
    const { result } = renderHook(() => useFloatingHover(true, 150));
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on modal
    act(() => {
      result.current.hoverHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    // Simulate mouse leave from modal
    act(() => {
      result.current.hoverHandlers.onMouseLeave?.();
    });
    // Should still be true until timer runs
    expect(result.current.shouldShowFloating).toBe(true);

    // Fast-forward timers
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.shouldShowFloating).toBe(false);

    // Simulate hover on floating button
    act(() => {
      result.current.floatingHandlers.onMouseEnter?.();
    });
    expect(result.current.shouldShowFloating).toBe(true);

    // Simulate mouse leave from floating button
    act(() => {
      result.current.floatingHandlers.onMouseLeave?.();
    });
    // Should still be true until timer runs
    expect(result.current.shouldShowFloating).toBe(true);

    // Fast-forward timers
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.shouldShowFloating).toBe(false);
  });
});
