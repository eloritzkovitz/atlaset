import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("foo", 500));
    expect(result.current).toBe("foo");
  });

  it("updates the value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "foo", delay: 500 } }
    );

    rerender({ value: "bar", delay: 500 });
    expect(result.current).toBe("foo"); // still old value

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("bar");
  });

  it("resets the timer if value changes before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "foo", delay: 300 } }
    );

    rerender({ value: "bar", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: "baz", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Not enough time has passed for the last value
    expect(result.current).toBe("foo");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe("baz");
  });
});
