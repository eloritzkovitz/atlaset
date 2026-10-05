import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getInputCapabilities,
  useInputCapabilities,
} from "./useInputCapabilities";

type MediaQueryMock = MediaQueryList & {
  notify: (matches: boolean) => void;
};

const createMediaQuery = (matches: boolean): MediaQueryMock => {
  const listeners = new Set<() => void>();
  let currentMatches = matches;
  const query: MediaQueryMock = {
    media: "",
    get matches() {
      return currentMatches;
    },
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_event: string, listener: () => void) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_event: string, listener: () => void) => {
      listeners.delete(listener);
    }),
    dispatchEvent: vi.fn(),
    notify(nextMatches: boolean) {
      currentMatches = nextMatches;
      listeners.forEach((listener) => listener());
    },
  };
  return query;
};

describe("useInputCapabilities", () => {
  const originalWindow = window;
  let hoverQuery: MediaQueryMock;
  let coarsePointerQuery: MediaQueryMock;

  beforeEach(() => {
    hoverQuery = createMediaQuery(true);
    coarsePointerQuery = createMediaQuery(false);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) =>
        query === "(hover: hover) and (pointer: fine)"
          ? hoverQuery
          : coarsePointerQuery,
      ),
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.stubGlobal("window", originalWindow);
    vi.restoreAllMocks();
  });

  it("reports initial hover and pointer capabilities", () => {
    const { result } = renderHook(() => useInputCapabilities());

    expect(result.current.canHover).toBe(true);
    expect(result.current.isTouchDevice).toBe(false);
    expect(result.current.isTouchInteraction()).toBe(false);
  });

  it("returns safe defaults without a window", () => {
    vi.stubGlobal("window", undefined);

    expect(getInputCapabilities()).toEqual({
      canHover: false,
      isTouchDevice: false,
    });
  });

  it("detects touch support from navigator", () => {
    Object.defineProperty(navigator, "maxTouchPoints", { value: 1 });

    const { result } = renderHook(() => useInputCapabilities());

    expect(result.current.isTouchDevice).toBe(true);
  });

  it("updates when media-query capabilities change", () => {
    const { result } = renderHook(() => useInputCapabilities());

    act(() => {
      hoverQuery.notify(false);
      coarsePointerQuery.notify(true);
    });

    expect(result.current.canHover).toBe(false);
    expect(result.current.isTouchDevice).toBe(true);
  });

  it("tracks touch and non-touch pointer interactions", () => {
    const { result } = renderHook(() => useInputCapabilities());

    act(() => result.current.handlePointerDown("touch"));
    expect(result.current.isTouchInteraction()).toBe(true);

    act(() => result.current.handlePointerDown("mouse"));
    expect(result.current.isTouchInteraction()).toBe(false);
  });

  it("clears touch interaction state on keyboard input", () => {
    const { result } = renderHook(() => useInputCapabilities());

    act(() => result.current.handlePointerDown("touch"));
    act(() => result.current.handleKeyDown());

    expect(result.current.isTouchInteraction()).toBe(false);
  });

  it("removes media-query listeners on unmount", () => {
    const { unmount } = renderHook(() => useInputCapabilities());

    unmount();

    expect(hoverQuery.removeEventListener).toHaveBeenCalledOnce();
    expect(coarsePointerQuery.removeEventListener).toHaveBeenCalledOnce();
  });
});
