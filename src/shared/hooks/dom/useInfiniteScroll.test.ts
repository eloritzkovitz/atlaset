import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let observerCallback: IntersectionObserverCallback;
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  let originalObserver: typeof IntersectionObserver;

  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();
    originalObserver = global.IntersectionObserver;

    global.IntersectionObserver = function (
      callback: IntersectionObserverCallback,
    ) {
      observerCallback = callback;

      return {
        observe: observeMock,
        disconnect: disconnectMock,
        root: null,
        rootMargin: "",
        thresholds: [],
        takeRecords: () => [],
        unobserve: vi.fn(),
      };
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalObserver;
  });

  it("observes the node and handles intersection", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useInfiniteScroll(callback, true));
    const node = document.createElement("div");

    act(() => result.current(node));

    expect(observeMock).toHaveBeenCalledWith(node);

    act(() => {
      observerCallback(
        [{ isIntersecting: true }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });

    expect(callback).toHaveBeenCalledOnce();

    act(() => {
      observerCallback(
        [{ isIntersecting: false }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });

    expect(callback).toHaveBeenCalledOnce();
  });

  it("does not observe when disabled", () => {
    const { result } = renderHook(() => useInfiniteScroll(vi.fn(), false));

    act(() => result.current(document.createElement("div")));

    expect(observeMock).not.toHaveBeenCalled();
  });

  it("disconnects when ref changes and on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useInfiniteScroll(vi.fn(), true),
    );
    const node = document.createElement("div");

    act(() => result.current(node));
    act(() => result.current(null));

    expect(disconnectMock).toHaveBeenCalledOnce();

    act(() => result.current(node));
    unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(2);
  });
});
