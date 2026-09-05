import { renderHook, act } from "@testing-library/react";
import { useSwipeNavigation } from "./useSwipeNavigation";

describe("useSwipeNavigation", () => {
  it("calls onNext for left swipe (LTR)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, false),
    );

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as never);
    });
    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 30 }],
      } as never);
    });
    expect(onNext).toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("calls onPrev for right swipe (LTR)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, false),
    );

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as never);
    });
    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 180 }],
      } as never);
    });
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("calls onPrev for left swipe (RTL)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, true),
    );

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as never);
    });
    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 30 }],
      } as never);
    });
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("calls onNext for right swipe (RTL)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, true),
    );

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as never);
    });
    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 180 }],
      } as never);
    });
    expect(onNext).toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("does not call callbacks for small swipes", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation(onPrev, onNext, false),
    );

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as never);
    });
    act(() => {
      result.current.handleTouchEnd({
        changedTouches: [{ clientX: 90 }],
      } as never);
    });
    expect(onPrev).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
