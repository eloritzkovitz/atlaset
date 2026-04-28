import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAnimatedNumber } from "./useAnimatedNumber";

describe("useAnimatedNumber", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each([
    [100, 320],
    [0, 320],
  ])("starts at 0 and animates to %s over %dms", (target, duration) => {
    const { result } = renderHook(() =>
      useAnimatedNumber(target as number, duration as number),
    );
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(duration as number));
    expect(result.current).toBe(target as number);
  });

  it("animates in steps and does not exceed target", () => {
    const { result } = renderHook(() => useAnimatedNumber(50, 160));
    act(() => vi.advanceTimersByTime(80));
    expect(result.current).toBeLessThanOrEqual(50);
    act(() => vi.advanceTimersByTime(80));
    expect(result.current).toBe(50);
  });

  it("resets and animates to new target when target changes", () => {
    const { result, rerender } = renderHook(
      ({ target }) => useAnimatedNumber(target as number, 320),
      {
        initialProps: { target: 50 },
      },
    );
    act(() => {
      vi.advanceTimersByTime(320);
      vi.runAllTimers();
    });
    expect(result.current).toBe(50);
    rerender({ target: 80 });
    act(() => vi.advanceTimersByTime(0));
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(320));
    expect(result.current).toBe(80);
  });
});
