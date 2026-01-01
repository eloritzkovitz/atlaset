import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMenuPosition } from "./useMenuPosition";

function mockRect({
  top = 0,
  bottom = 40,
  right = 100,
  width = 100,
  height = 40,
} = {}) {
  return {
    top,
    bottom,
    right,
    left: right - width,
    width,
    height,
    x: right - width,
    y: top,
    toJSON: () => {},
  } as DOMRect;
}

describe("useMenuPosition", () => {
  let btn: HTMLDivElement;
  let menu: HTMLDivElement;

  beforeEach(() => {
    btn = document.createElement("div");
    menu = document.createElement("div");
    document.body.appendChild(btn);
    document.body.appendChild(menu);
  });

  it("returns correct style when open and enough space below", () => {
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 100, bottom: 140, right: 200 })
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect({ height: 40, width: 100 })
    );

    const { result } = renderHook(() =>
      useMenuPosition(true, { current: btn }, { current: menu })
    );

    expect(result.current.position).toBe("absolute");
    expect(result.current.zIndex).toBe(1000);
    expect(result.current.top).toBe(100 + window.scrollY);
    expect(result.current.left).toBe(100 + window.scrollX);
  });

  it("flips above if not enough space below", () => {
    // Not enough space below, but enough above
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 500, bottom: 540, right: 200 })
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect({ height: 100, width: 100 })
    );

    // Simulate small viewport
    vi.stubGlobal("window", {
      ...window,
      innerHeight: 550,
      scrollY: 0,
      scrollX: 0,
    });

    const { result } = renderHook(() =>
      useMenuPosition(true, { current: btn }, { current: menu })
    );

    // Should flip above
    expect(result.current.top).toBe(500 - 100 + window.scrollY);
  });

  it("returns empty style when not open or refs missing", () => {
    const { result } = renderHook(() =>
      useMenuPosition(false, { current: btn }, { current: menu })
    );
    expect(result.current).toEqual({});
    const { result: result2 } = renderHook(() =>
      useMenuPosition(true, { current: null }, { current: menu })
    );
    expect(result2.current).toEqual({});
  });
});
