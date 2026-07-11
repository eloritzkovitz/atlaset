import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { mockAnimationsEnabled } from "@test-utils/settingsMocks";
import { useModalAnimation } from "./useModalAnimation";

describe("useModalAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockAnimationsEnabled(true);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("Standard Animated Path", () => {
    it("opens the modal", () => {
      const { result } = renderHook(() => useModalAnimation());
      act(() => result.current.openModal());
      expect(result.current.isOpen).toBe(true);
      expect(result.current.closing).toBe(false);
    });

    it("closes the modal with animation", () => {
      const { result } = renderHook(() => useModalAnimation());
      act(() => result.current.openModal());
      act(() => result.current.closeModal());
      expect(result.current.closing).toBe(true);

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.isOpen).toBe(false);
      expect(result.current.closing).toBe(false);
    });

    it("can set isOpen directly", () => {
      const { result } = renderHook(() => useModalAnimation());
      act(() => result.current.setIsOpen(true));
      expect(result.current.isOpen).toBe(true);
      act(() => result.current.setIsOpen(false));
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("Accessibility Bypassed Path", () => {
    it("should close the modal instantly without asynchronous timer ticks when animations are disabled", () => {
      mockAnimationsEnabled(false);

      const { result } = renderHook(() => useModalAnimation(200));

      act(() => result.current.openModal());
      expect(result.current.isOpen).toBe(true);

      act(() => result.current.closeModal());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.closing).toBe(false);
    });
  });
});
