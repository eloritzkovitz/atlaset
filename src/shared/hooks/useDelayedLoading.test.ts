import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDelayedLoading } from "./useDelayedLoading";

describe("useDelayedLoading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when loading is true", () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useDelayedLoading(loading),
      { initialProps: { loading: true } }
    );
    expect(result.current).toBe(true);

    // If loading stays true, should remain true
    rerender({ loading: true });
    expect(result.current).toBe(true);
  });

  it("returns true for minDelay after loading becomes false", () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useDelayedLoading(loading, [], 500),
      { initialProps: { loading: true } }
    );
    expect(result.current).toBe(true);

    // Set loading to false
    rerender({ loading: false });
    expect(result.current).toBe(true);

    // Advance time less than minDelay
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe(true);

    // Advance time to minDelay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(false);
  });

  it("resets to true if loading becomes true again", () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useDelayedLoading(loading, [], 300),
      { initialProps: { loading: true } }
    );
    expect(result.current).toBe(true);

    rerender({ loading: false });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(false);

    // Set loading back to true
    rerender({ loading: true });
    expect(result.current).toBe(true);
  });
});
