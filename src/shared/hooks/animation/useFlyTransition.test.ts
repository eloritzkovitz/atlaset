import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { mockAnimationsEnabled } from "@test-utils/settingsMocks";
import { useFlyTransition } from "./useFlyTransition";

describe("useFlyTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockAnimationsEnabled(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Standard Animated Mode", () => {
    it("should start visible and not animating by default", () => {
      const { result } = renderHook(() => useFlyTransition());
      expect(result.current.visible).toBe(true);
      expect(result.current.animating).toBe(false);
      expect(result.current.animationClass).toBe("animate-fly-in-start");
    });

    it("should start hidden if initialVisible is false", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ initialVisible: false }),
      );
      expect(result.current.visible).toBe(false);
    });

    it("should animate fly-out and then hide after duration", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ duration: 500, direction: "start" }),
      );

      act(() => {
        result.current.hide();
      });
      expect(result.current.animating).toBe(true);
      expect(result.current.animationClass).toBe("animate-fly-out-start");

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current.visible).toBe(false);
      expect(result.current.animating).toBe(false);
    });

    it("should animate fly-in when show() is called", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ initialVisible: false, direction: "start" }),
      );
      act(() => {
        result.current.show();
      });
      expect(result.current.visible).toBe(true);
      expect(result.current.animationClass).toBe("animate-fly-in-start");
    });

    it("should use correct animation class for direction", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ direction: "end" }),
      );

      act(() => {
        result.current.hide();
      });
      expect(result.current.animationClass).toBe("animate-fly-out-end");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      act(() => {
        result.current.show();
      });
      expect(result.current.animationClass).toBe("animate-fly-in-end");
    });

    it("should reset to fly-in after fly-out and show", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ direction: "start" }),
      );

      act(() => {
        result.current.hide();
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      act(() => {
        result.current.show();
      });
      expect(result.current.animationClass).toBe("animate-fly-in-start");
    });
  });

  describe("Accessibility / Reduced Motion Mode", () => {
    beforeEach(() => {
      mockAnimationsEnabled(false);
    });

    it("should fallback to stationary fade classes instantly on load", () => {
      const { result } = renderHook(() => useFlyTransition());
      expect(result.current.animationClass).toBe("animate-fade-in");
    });

    it("should transition states immediately without timeout intervals on trigger", () => {
      const { result } = renderHook(() =>
        useFlyTransition({ duration: 500, initialVisible: true }),
      );

      act(() => {
        result.current.hide();
      });

      expect(result.current.visible).toBe(false);
      expect(result.current.animating).toBe(false);
      expect(result.current.animationClass).toBe("animate-fade-out");
    });
  });
});
