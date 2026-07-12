import { renderHook, act } from "@testing-library/react";
import { useSwipeNavigation } from "./useSwipeNavigation";

describe("useSwipeNavigation", () => {
  it("calls onNext for left swipe (LTR)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext, false));

    // Simulate touch start at x=100
    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });
    // Simulate touch end at x=30 (left swipe, distance 70)
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 30 }] } as any);
    });
    expect(onNext).toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("calls onPrev for right swipe (LTR)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext, false));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 180 }] } as any);
    });
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("calls onPrev for left swipe (RTL)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext, true));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 30 }] } as any);
    });
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("calls onNext for right swipe (RTL)", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext, true));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 180 }] } as any);
    });
    expect(onNext).toHaveBeenCalled();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it("does not call callbacks for small swipes", () => {
    const onPrev = vitest.fn();
    const onNext = vitest.fn();
    const { result } = renderHook(() => useSwipeNavigation(onPrev, onNext, false));

    act(() => {
      result.current.handleTouchStart({ touches: [{ clientX: 100 }] } as any);
    });
    act(() => {
      result.current.handleTouchEnd({ changedTouches: [{ clientX: 90 }] } as any);
    });
    expect(onPrev).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
