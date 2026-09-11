import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";
import {
  useScrollVisibility,
  isElementScrollable,
} from "./useScrollVisibility";

function createRef(scrollHeight = 1000, clientHeight = 500) {
  const element = document.createElement("div");

  Object.defineProperties(element, {
    scrollHeight: { value: scrollHeight, configurable: true },
    clientHeight: { value: clientHeight, configurable: true },
  });

  document.body.appendChild(element);

  return {
    element,
    ref: { current: element } as RefObject<HTMLDivElement | null>,
  };
}

describe("useScrollVisibility", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("initializes scrollability and scroll state", () => {
    const { ref } = createRef();
    const onScroll = vi.fn((value: number) => value);

    const { result } = renderHook(() =>
      useScrollVisibility(ref, onScroll, [], 7),
    );

    expect(result.current).toEqual([7, true]);
  });

  it("handles scroll events with and without a callback", () => {
    const { element, ref } = createRef();
    const onScroll = vi.fn((value: number) => value);

    const { result } = renderHook(() => useScrollVisibility(ref, onScroll));

    act(() => {
      element.scrollTop = 42;
      element.dispatchEvent(new Event("scroll"));
    });

    expect(onScroll).toHaveBeenCalledWith(42);
    expect(result.current[0]).toBe(42);

    const { ref: noCallbackRef } = createRef();

    renderHook(() => useScrollVisibility(noCallbackRef));

    act(() => {
      noCallbackRef.current!.scrollTop = 20;
      noCallbackRef.current!.dispatchEvent(new Event("scroll"));
    });

    const nullRef = { current: null } as RefObject<HTMLElement | null>;

    renderHook(() => useScrollVisibility(nullRef));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  });

  it("updates scrollability on resize and mutation", async () => {
    const { element, ref } = createRef(500, 500);

    const { result } = renderHook(() => useScrollVisibility(ref));

    expect(result.current[1]).toBe(false);

    act(() => {
      Object.defineProperty(element, "scrollHeight", {
        value: 1000,
        configurable: true,
      });
      element.textContent = "updated";
    });

    await vi.waitFor(() => {
      expect(result.current[1]).toBe(true);
    });

    act(() => {
      Object.defineProperty(element, "clientHeight", {
        value: 1200,
        configurable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current[1]).toBe(false);
  });

  it("covers scrollability helper", () => {
    expect(isElementScrollable(null)).toBe(false);
    expect(isElementScrollable(undefined)).toBe(false);

    const { element } = createRef(1000, 500);

    expect(isElementScrollable(element)).toBe(true);

    Object.defineProperty(element, "scrollHeight", {
      value: 500,
      configurable: true,
    });

    expect(isElementScrollable(element)).toBe(false);
  });
});
