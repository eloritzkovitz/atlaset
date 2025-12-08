import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let observeMock: any;
  let unobserveMock: any;
  let IntersectionObserverBackup: any;

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    IntersectionObserverBackup = global.IntersectionObserver;
    global.IntersectionObserver = vi.fn(function () {
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: vi.fn(),
      };
    }) as any;
  });
  afterEach(() => {
    global.IntersectionObserver = IntersectionObserverBackup;
    vi.restoreAllMocks();
  });

  it("should observe the ref when enabled", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };
    renderHook(() => useInfiniteScroll(ref, callback, true));
    expect(observeMock).toHaveBeenCalledWith(ref.current);
  });

  it("should not observe the ref when not enabled", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };
    renderHook(() => useInfiniteScroll(ref, callback, false));
    expect(observeMock).not.toHaveBeenCalled();
  });

  it("should unobserve on cleanup", () => {
    const callback = vi.fn();
    const ref = { current: document.createElement("div") };
    const { unmount } = renderHook(() =>
      useInfiniteScroll(ref, callback, true)
    );
    unmount();
    expect(unobserveMock).toHaveBeenCalledWith(ref.current);
  });
});
