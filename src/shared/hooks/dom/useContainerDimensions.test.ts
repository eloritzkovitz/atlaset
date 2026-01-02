import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useContainerDimensions } from "./useContainerDimensions";

describe("useContainerDimensions", () => {
  let ref: React.RefObject<HTMLDivElement | null>;

  beforeEach(() => {
    ref = { current: null };
  });

  it("returns default dimensions when ref is null", () => {
    const { result } = renderHook(() => useContainerDimensions(ref));
    expect(result.current).toEqual({ width: 800, height: 600 });
  });

  it("returns the element's dimensions when ref is set", () => {
    const div = document.createElement("div");
    Object.defineProperty(div, "offsetWidth", {
      value: 123,
      configurable: true,
    });
    Object.defineProperty(div, "offsetHeight", {
      value: 456,
      configurable: true,
    });
    ref.current = div;

    const { result } = renderHook(() => useContainerDimensions(ref));
    // The effect runs after mount, so we need to wait for it
    expect(result.current).toEqual({ width: 123, height: 456 });
  });

  it("updates dimensions on window resize", () => {
    const div = document.createElement("div");
    let width = 200;
    let height = 300;
    Object.defineProperty(div, "offsetWidth", {
      get: () => width,
      configurable: true,
    });
    Object.defineProperty(div, "offsetHeight", {
      get: () => height,
      configurable: true,
    });
    ref.current = div;

    const { result } = renderHook(() => useContainerDimensions(ref));

    expect(result.current).toEqual({ width: 200, height: 300 });

    // Change the size
    width = 400;
    height = 500;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({ width: 400, height: 500 });
  });
});
