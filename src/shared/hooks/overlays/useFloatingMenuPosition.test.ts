import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFloatingMenuPosition } from "./useFloatingMenuPosition";

function setup(
  mainRect: { left: number; right: number; top: number },
  width = 180,
  height = 300,
  windowWidth = 1200,
  windowHeight = 800,
) {
  Object.defineProperty(window, "innerWidth", {
    value: windowWidth,
    configurable: true,
  });
  Object.defineProperty(window, "innerHeight", {
    value: windowHeight,
    configurable: true,
  });

  const main = document.createElement("div");
  const floating = document.createElement("div");

  Object.defineProperty(main, "getBoundingClientRect", {
    value: () => mainRect,
  });
  Object.defineProperty(floating, "offsetWidth", { value: width });
  Object.defineProperty(floating, "offsetHeight", { value: height });

  const mainRef = { current: main };
  const floatingRef = { current: floating };

  return renderHook(() => useFloatingMenuPosition(mainRef, floatingRef, 0, 0));
}

describe("useFloatingMenuPosition", () => {
  it("positions right or left based on available space", () => {
    expect(setup({ left: 100, right: 200, top: 50 }).result.current).toEqual({
      left: 200,
      top: 50,
    });

    expect(setup({ left: 1000, right: 1100, top: 50 }).result.current).toEqual({
      left: 820,
      top: 50,
    });
  });

  it("adjusts overflowing top position", () => {
    expect(setup({ left: 100, right: 200, top: 700 }).result.current).toEqual({
      left: 200,
      top: 492,
    });

    expect(setup({ left: 100, right: 200, top: 0 }).result.current).toEqual({
      left: 200,
      top: 8,
    });
  });

  it("uses fallback dimensions", () => {
    expect(
      setup({ left: 100, right: 200, top: 50 }, 0, 0).result.current,
    ).toEqual({
      left: 200,
      top: 50,
    });
  });

  it("uses defaults when refs are missing", () => {
    const mainRef = { current: null };
    const floatingRef = { current: null };

    const { result } = renderHook(() =>
      useFloatingMenuPosition(mainRef, floatingRef, 42, 99),
    );

    expect(result.current).toEqual({ left: 42, top: 99 });
  });
});
