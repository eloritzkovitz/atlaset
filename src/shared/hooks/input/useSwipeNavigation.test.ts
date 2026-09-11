import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSwipeNavigation } from "./useSwipeNavigation";

const touchStart = (x: number) =>
  ({
    touches: [{ clientX: x }],
  }) as unknown as React.TouchEvent;

const touchEnd = (x: number) =>
  ({
    changedTouches: [{ clientX: x }],
  }) as unknown as React.TouchEvent;

describe("useSwipeNavigation", () => {
  it("handles LTR swipes", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext));

    act(() => result.current.handleTouchStart(touchStart(500)));
    act(() => result.current.handleTouchEnd(touchEnd(400)));

    act(() => result.current.handleTouchStart(touchStart(500)));
    act(() => result.current.handleTouchEnd(touchEnd(600)));

    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it("handles RTL swipes", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, true),
    );

    act(() => result.current.handleTouchStart(touchStart(500)));
    act(() => result.current.handleTouchEnd(touchEnd(400)));

    act(() => result.current.handleTouchStart(touchStart(500)));
    act(() => result.current.handleTouchEnd(touchEnd(600)));

    expect(onPrev).toHaveBeenCalledOnce();
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("ignores short and missing swipes", () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext));

    act(() => result.current.handleTouchEnd(touchEnd(400)));

    act(() => result.current.handleTouchStart(touchStart(500)));
    act(() => result.current.handleTouchEnd(touchEnd(460)));

    expect(onPrev).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
