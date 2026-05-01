vi.mock("@hooks", () => ({ useLanguage: vi.fn() }));

import { useLanguage } from "@features/settings";
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
    (useLanguage as unknown as any).mockReturnValue({ isRtl: false });
  });

  const run = (opts: {
    btnRect?: any;
    menuRect?: any;
    args?: any[];
    rtl?: boolean;
    expect?: Record<string, number>;
    setupWindow?: (() => void) | null;
  }) => {
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect(opts.btnRect),
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect(opts.menuRect),
    );
    (useLanguage as unknown as any).mockReturnValue({
      isRtl: opts.rtl ?? false,
    });
    if (opts.setupWindow) opts.setupWindow();
    const { result } = renderHook(() =>
      useMenuPosition(
        true,
        { current: btn },
        { current: menu },
        ...(opts.args || []),
      ),
    );

    const b = btn.getBoundingClientRect() as DOMRect;
    const m = menu.getBoundingClientRect() as DOMRect;
    const align = opts.args?.[1] as string | undefined;
    const placement = opts.args?.[2] as string | undefined;
    const rtl = opts.rtl ?? false;

    let expectedLeft: number;
    if (align === "top") {
      expectedLeft = b.left + window.scrollX;
    } else if (placement === "overlay") {
      expectedLeft =
        align === "left"
          ? b.left - m.width + window.scrollX
          : b.left + window.scrollX;
    } else {
      if (align === "left") {
        expectedLeft = rtl
          ? b.right + window.scrollX
          : b.left - m.width + window.scrollX;
      } else {
        expectedLeft = rtl
          ? b.left - m.width + window.scrollX
          : b.right + window.scrollX;
      }
    }

    const offset = opts.args?.[0] ?? 0;
    const spaceBelow = window.innerHeight - b.bottom;
    const spaceAbove = b.top;
    let expectedTop = b.top + window.scrollY + offset;
    if (placement !== "top" && spaceBelow < m.height && spaceAbove > m.height) {
      expectedTop = b.top + window.scrollY - m.height;
    }
    if (align === "top") {
      expectedTop = b.top + window.scrollY - m.height - offset;
    }

    expect((result.current as any).left).toBe(expectedLeft);
    expect((result.current as any).top).toBe(expectedTop);
  };

  it("basic positioning and overlay/adjacent variants", () => {
    run({
      btnRect: { top: 100, bottom: 140, right: 200 },
      menuRect: { height: 40, width: 100 },
      expect: { left: 200, top: 100 },
    });

    run({
      btnRect: { top: 500, bottom: 540, right: 200 },
      menuRect: { height: 100, width: 100 },
      expect: { top: 500 - 100 },
      setupWindow: () =>
        vi.stubGlobal("window", {
          ...window,
          innerHeight: 550,
          scrollY: 0,
          scrollX: 0,
        }),
    });

    run({
      btnRect: { top: 200, bottom: 240, right: 200 },
      menuRect: { height: 50, width: 100 },
      args: [10, "top"],
      expect: { top: 200 - 50 - 10, left: 100 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "left", "overlay"],
      expect: { left: 0 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "right", "overlay"],
      expect: { left: 100 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 200 },
      menuRect: { height: 40, width: 100 },
      args: [0, "right", "adjacent"],
      expect: { left: 200 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 200 },
      menuRect: { height: 40, width: 100 },
      rtl: true,
      args: [0, "right", "adjacent"],
      expect: { left: 0 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 200, width: 100 },
      menuRect: { height: 40, width: 100 },
      args: [0, "left", "adjacent"],
      expect: { left: 0 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 300, width: 150 },
      menuRect: { height: 40, width: 120 },
      expect: { left: 300 },
    });

    run({
      btnRect: { top: 100, bottom: 140, right: 300, width: 150 },
      menuRect: { height: 40, width: 120 },
      rtl: true,
      expect: { left: 30 },
    });
  });

  it("width handling and empty refs", () => {
    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(
      mockRect({ top: 100, bottom: 140, right: 200, width: 120 }),
    );
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(
      mockRect({ height: 40, width: 80 }),
    );
    const { result } = renderHook(() =>
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
    expect((result.current as any).width).toBeUndefined();

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
