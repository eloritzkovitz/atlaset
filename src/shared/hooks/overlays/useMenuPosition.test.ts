import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
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
  } as unknown as DOMRect;
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

  afterEach(() => {
    document.documentElement.removeAttribute("dir");
    document.body.removeAttribute("dir");
    document.dir = "";
    document.body.dir = "";
    vi.restoreAllMocks();
  });

  const runTest = (opts: {
    btnRect?: Parameters<typeof mockRect>[0];
    menuRect?: Parameters<typeof mockRect>[0];
    args?: any[];
    rtl?: boolean;
    windowHeight?: number;
    expectedLeft: number;
    expectedTop: number;
  }) => {
    const dirVal = opts.rtl ? "rtl" : "ltr";

    document.dir = dirVal;
    document.body.dir = dirVal;
    document.documentElement.setAttribute("dir", dirVal);
    document.body.setAttribute("dir", dirVal);

    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect(opts.btnRect),
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect(opts.menuRect),
    );

    if (opts.windowHeight !== undefined) {
      vi.stubGlobal("innerHeight", opts.windowHeight);
    }

    const { result } = renderHook(() =>
      useMenuPosition(
        true,
        { current: btn },
        { current: menu },
        ...(opts.args || []),
      ),
    );

    expect((result.current as any).left).toBe(opts.expectedLeft);
    expect((result.current as any).top).toBe(opts.expectedTop);
  };

  it("calculates basic positioning and placement variants", () => {
    runTest({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      expectedLeft: 200,
      expectedTop: 100,
    });

    runTest({
      btnRect: { top: 200, bottom: 240, right: 200, width: 100 },
      menuRect: { height: 50, width: 100 },
      args: [10, "top"],
      expectedLeft: 100,
      expectedTop: 200 - 50 - 10,
    });

    runTest({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "left", "overlay"],
      expectedLeft: 0,
      expectedTop: 100,
    });

    runTest({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "right", "overlay"],
      expectedLeft: 100,
      expectedTop: 100,
    });

    runTest({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "left", "adjacent"],
      expectedLeft: 0,
      expectedTop: 100,
    });
  });

  it("handles RTL direction swapping correctly", () => {
    runTest({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      rtl: true,
      args: [0, "right", "adjacent"],
      expectedLeft: 0,
      expectedTop: 100,
    });

    runTest({
      btnRect: { top: 100, bottom: 140, right: 300, width: 150 },
      menuRect: { height: 40, width: 120 },
      rtl: true,
      expectedLeft: 30,
      expectedTop: 100,
    });
  });

  it("flips above when space below is constrained", () => {
    runTest({
      btnRect: { top: 500, bottom: 540, right: 200, width: 100 },
      menuRect: { height: 100, width: 100 },
      windowHeight: 550,
      expectedLeft: 200,
      expectedTop: 500 - 100,
    });
  });

  it("handles width options and inactive states", () => {
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 100, bottom: 140, right: 200, width: 120 }),
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect({ height: 40, width: 80 }),
    );

    const { result: r1 } = renderHook(() =>
      useMenuPosition(
        true,
        { current: btn },
        { current: menu },
        0,
        "right",
        undefined,
        false,
      ),
    );
    expect((r1.current as any).width).toBeUndefined();

    const { result: r2 } = renderHook(() =>
      useMenuPosition(false, { current: btn }, { current: menu }),
    );
    expect(r2.current).toEqual({});

    const { result: r3 } = renderHook(() =>
      useMenuPosition(true, { current: null }, { current: menu }),
    );
    expect(r3.current).toEqual({});
  });
});
