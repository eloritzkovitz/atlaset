import { vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAtomicTimer } from "./useAtomicTimer";

describe("useAtomicTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with the correct duration", () => {
    const { result } = renderHook(() => useAtomicTimer(60, false));
    expect(result.current.timeLeft).toBe(60);
  });

  it("should tick down when active and started", () => {
    const { result } = renderHook(() => useAtomicTimer(10, true));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(7);
  });

  it("should not tick below 0", () => {
    const { result } = renderHook(() => useAtomicTimer(5, true));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(result.current.timeLeft).toBe(0);
  });

  it("should stop ticking when active is toggled to false", () => {
    const { result, rerender } = renderHook(
      ({ active }) => useAtomicTimer(10, active),
      { initialProps: { active: true } },
    );

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(8);

    rerender({ active: false });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(8);
  });
});
