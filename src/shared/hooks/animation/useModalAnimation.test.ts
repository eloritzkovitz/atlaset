import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useModalAnimation } from "./useModalAnimation";

describe("useModalAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

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
    // Fast-forward timer
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
