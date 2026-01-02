import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlyTransition } from "./useFlyTransition";

describe("useFlyTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start visible and not animating by default", () => {
    const { result } = renderHook(() => useFlyTransition());
    expect(result.current.visible).toBe(true);
    expect(result.current.animating).toBe(false);
    expect(result.current.animationClass).toBe("animate-fly-in");
  });

  it("should start hidden if initialVisible is false", () => {
    const { result } = renderHook(() =>
      useFlyTransition({ initialVisible: false })
    );
    expect(result.current.visible).toBe(false);
  });

  it("should animate fly-out and then hide after duration", () => {
    const { result } = renderHook(() =>
      useFlyTransition({ duration: 500, direction: "left" })
    );
    act(() => {
      result.current.trigger();
    });
    expect(result.current.animating).toBe(true);
    expect(result.current.animationClass).toBe("animate-fly-out-left");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.visible).toBe(false);
    expect(result.current.animating).toBe(false);
  });

  it("should animate fly-in when show() is called", () => {
    const { result } = renderHook(() =>
      useFlyTransition({ initialVisible: false, direction: "left" })
    );
    act(() => {
      result.current.show();
    });
    expect(result.current.visible).toBe(true);
    expect(result.current.animationClass).toBe("animate-fly-in-left");
  });

  it("should use correct animation class for direction", () => {
    const { result } = renderHook(() =>
      useFlyTransition({ direction: "right" })
    );
    act(() => {
      result.current.trigger();
    });
    expect(result.current.animationClass).toBe("animate-fly-out-right");
    vi.advanceTimersByTime(500);
    act(() => {
      result.current.show();
    });
    expect(result.current.animationClass).toBe("animate-fly-in-right");
  });

  it("should reset to fly-in after fly-out and show", () => {
    const { result } = renderHook(() =>
      useFlyTransition({ direction: "left" })
    );
    act(() => {
      result.current.trigger();
    });
    vi.advanceTimersByTime(500);
    act(() => {
      result.current.show();
    });
    expect(result.current.animationClass).toBe("animate-fly-in-left");
  });
});
