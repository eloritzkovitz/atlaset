import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFlyTransition } from "./useFlyTransition";

describe("useFlyTransition", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const renderAnimated = (
    options: Parameters<typeof useFlyTransition>[0] = {},
  ) =>
    renderHook(() =>
      useFlyTransition({
        ...options,
        animationsEnabled: true,
      }),
    );

  describe("Animated Mode", () => {
    it("starts visible and idle", () => {
      const { result } = renderAnimated();

      expect(result.current).toMatchObject({
        visible: true,
        animating: false,
        animationClass: "animate-fly-in-start",
      });
    });

    it("supports starting hidden", () => {
      const { result } = renderAnimated({ initialVisible: false });

      expect(result.current.visible).toBe(false);
    });

    it("hides after fly-out animation", () => {
      const { result } = renderAnimated({
        duration: 500,
        direction: "start",
      });

      act(() => result.current.hide());

      expect(result.current).toMatchObject({
        animating: true,
        animationClass: "animate-fly-out-start",
      });

      act(() => vi.advanceTimersByTime(500));

      expect(result.current).toMatchObject({
        visible: false,
        animating: false,
      });
    });

    it("shows with the correct direction", () => {
      const { result } = renderAnimated({
        initialVisible: false,
        direction: "end",
      });

      act(() => result.current.show());

      expect(result.current).toMatchObject({
        visible: true,
        animationClass: "animate-fly-in-end",
      });
    });

    it("resets to fly-in after hiding", () => {
      const { result } = renderAnimated({ duration: 500 });

      act(() => result.current.hide());
      act(() => vi.advanceTimersByTime(500));
      act(() => result.current.show());

      expect(result.current.animationClass).toBe("animate-fly-in-start");
    });
  });

  describe("Reduced Motion Mode", () => {
    const renderReducedMotion = (
      options: Parameters<typeof useFlyTransition>[0] = {},
    ) =>
      renderHook(() =>
        useFlyTransition({
          ...options,
          animationsEnabled: false,
        }),
      );

    it("uses fade-in without animation", () => {
      const { result } = renderReducedMotion();

      expect(result.current.animationClass).toBe("animate-fade-in");
    });

    it("changes state immediately when hidden", () => {
      const { result } = renderReducedMotion({
        initialVisible: true,
        duration: 500,
      });

      act(() => result.current.hide());

      expect(result.current).toMatchObject({
        visible: false,
        animating: false,
        animationClass: "animate-fade-out",
      });
    });
  });
});
