import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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

  it("gets dimensions and updates on resize", () => {
    const div = document.createElement("div");
    let width = 200;
    let height = 300;

    Object.defineProperties(div, {
      offsetWidth: { get: () => width },
      offsetHeight: { get: () => height },
    });

    ref.current = div;

    const { result } = renderHook(() => useContainerDimensions(ref));

    expect(result.current).toEqual({ width: 200, height: 300 });

    width = 400;
    height = 500;

    act(() => window.dispatchEvent(new Event("resize")));

    expect(result.current).toEqual({ width: 400, height: 500 });
  });

  it("handles resize when ref is null", () => {
    const { result } = renderHook(() => useContainerDimensions(ref));

    act(() => window.dispatchEvent(new Event("resize")));

    expect(result.current).toEqual({ width: 800, height: 600 });
  });
});
