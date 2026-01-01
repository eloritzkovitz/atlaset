import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAnimatedNumber } from "./useAnimatedNumber";

describe("useAnimatedNumber", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start at 0", () => {
    const { result } = renderHook(() => useAnimatedNumber(100));
    expect(result.current).toBe(0);
  });

  it("should animate to target value after duration", () => {
    const { result } = renderHook(() => useAnimatedNumber(100, 320));
    act(() => {
      vi.advanceTimersByTime(320);
    });
    expect(result.current).toBe(100);
  });

  it("should animate in steps and not exceed target", () => {
    const { result } = renderHook(() => useAnimatedNumber(50, 160));
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(result.current).toBeLessThanOrEqual(50);
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(result.current).toBe(50);
  });

  it("should reset and animate to new target when target changes", () => {
    const { result, rerender } = renderHook(({ target }) => useAnimatedNumber(target, 320), {
      initialProps: { target: 50 },
    });
    act(() => {
      vi.advanceTimersByTime(320);
      vi.runAllTimers();
    });
    expect(result.current).toBe(50);
    rerender({ target: 80 });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    expect(result.current).toBe(0);
    act(() => {
      vi.advanceTimersByTime(320);
    });
    expect(result.current).toBe(80);
  });

  it("should animate to 0 if target is 0", () => {
    const { result } = renderHook(() => useAnimatedNumber(0, 320));
    act(() => {
      vi.advanceTimersByTime(320);
    });
    expect(result.current).toBe(0);
  });
});
