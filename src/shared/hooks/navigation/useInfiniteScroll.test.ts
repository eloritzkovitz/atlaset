import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let observeMock: any;
  let unobserveMock: any;
  let disconnectMock: any;
  let IntersectionObserverBackup: any;

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();
    IntersectionObserverBackup = global.IntersectionObserver;
    global.IntersectionObserver = vi.fn(function (this: any, cb) {
      this.observe = observeMock;
      this.unobserve = unobserveMock;
      this.disconnect = disconnectMock;
      this.cb = cb;
    }) as any;
  });
  afterEach(() => {
    global.IntersectionObserver = IntersectionObserverBackup;
    vi.restoreAllMocks();
  });

  it("should observe the ref when enabled", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback, true));
    const node = document.createElement("div");
    act(() => {
      result.current(node);
    });
    expect(observeMock).toHaveBeenCalledWith(node);
  });

  it("should not observe the ref when not enabled", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback, false));
    const node = document.createElement("div");
    act(() => {
      result.current(node);
    });
    expect(observeMock).not.toHaveBeenCalled();
  });

  it("should disconnect when ref is set to null", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback, true));
    const node = document.createElement("div");
    act(() => {
      result.current(node);
    });
    act(() => {
      result.current(null);
    });
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("should disconnect on cleanup", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll(callback, true)
    );
    const node = document.createElement("div");
    act(() => {
      result.current(node);
    });
    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("calls callback when entry is intersecting", () => {
    let observerCallback: any;
    global.IntersectionObserver = vi.fn(function (this: any, cb) {
      observerCallback = cb;
      this.observe = observeMock;
      this.unobserve = unobserveMock;
      this.disconnect = disconnectMock;
    }) as any;

    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback, true));
    const node = document.createElement("div");
    act(() => {
      result.current(node);
    });

    // Simulate intersection
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    expect(callback).toHaveBeenCalled();
  });
});
