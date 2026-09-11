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

  it.each([
    [100, 320],
    [0, 320],
  ])(
    "starts at 0 and animates to %s over %dms when animations are enabled",
    (target, duration) => {
      const { result } = renderHook(() =>
        useAnimatedNumber(true, target, duration),
      );

      expect(result.current).toBe(0);

      act(() => {
        vi.advanceTimersByTime(duration);
      });

      expect(result.current).toBe(target);
    },
  );

  it("animates in steps and does not exceed target", () => {
    const { result } = renderHook(() => useAnimatedNumber(true, 50, 160));

    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(result.current).toBeLessThanOrEqual(50);

    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(result.current).toBe(50);
  });

  it("resets and animates to new target when target changes", () => {
    const { result, rerender } = renderHook(
      ({ target }) => useAnimatedNumber(true, target, 320),
      { initialProps: { target: 50 } },
    );

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(50);

    rerender({ target: 80 });

    expect(result.current).toBe(0);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(80);
  });

  it("instantly sets the target when animations are disabled", () => {
    const { result, rerender } = renderHook(
      ({ target }) => useAnimatedNumber(false, target, 640),
      { initialProps: { target: 45 } },
    );

    expect(result.current).toBe(45);

    rerender({ target: 99 });

    expect(result.current).toBe(99);
  });
});
