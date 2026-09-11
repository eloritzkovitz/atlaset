import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMenuPosition } from "./useMenuPosition";

function rect({
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
  } as DOMRect;
}

describe("useMenuPosition", () => {
  let btn: HTMLDivElement;
  let menu: HTMLDivElement;

  beforeEach(() => {
    btn = document.createElement("div");
    menu = document.createElement("div");

    vi.spyOn(btn, "getBoundingClientRect").mockReturnValue(rect());
    vi.spyOn(menu, "getBoundingClientRect").mockReturnValue(rect());
  });

  afterEach(() => {
    document.documentElement.removeAttribute("dir");
    document.body.removeAttribute("dir");
    document.dir = "";
    document.body.dir = "";
    vi.restoreAllMocks();
  });

  it("positions adjacent and overlay menus", () => {
    vi.mocked(btn.getBoundingClientRect).mockReturnValue(
      rect({ top: 100, bottom: 140, right: 200, width: 100 }),
    );
    vi.mocked(menu.getBoundingClientRect).mockReturnValue(
      rect({ width: 80, height: 50 }),
    );

    document.documentElement.dir = "ltr";

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          10,
          "right",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(200);

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "left",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(20);

    document.documentElement.dir = "rtl";

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "right",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(20);

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "left",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(200);

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "left",
          "overlay",
        ),
      ).result.current.left,
    ).toBe(20);

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "right",
          "overlay",
        ),
      ).result.current.left,
    ).toBe(100);
  });

  it("positions a top menu with and without an offset", () => {
    vi.mocked(btn.getBoundingClientRect).mockReturnValue(
      rect({ top: 200, bottom: 240, right: 200, width: 100 }),
    );
    vi.mocked(menu.getBoundingClientRect).mockReturnValue(
      rect({ width: 100, height: 50 }),
    );

    expect(
      renderHook(() =>
        useMenuPosition(true, { current: btn }, { current: menu }, 10, "top"),
      ).result.current.top,
    ).toBe(140);

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "top",
        ),
      ).result.current.top,
    ).toBe(150);
  });

  it("uses document.dir and body.dir fallbacks", () => {
    document.documentElement.removeAttribute("dir");
    document.dir = "rtl";

    vi.mocked(btn.getBoundingClientRect).mockReturnValue(
      rect({ right: 200, width: 100 }),
    );
    vi.mocked(menu.getBoundingClientRect).mockReturnValue(rect({ width: 80 }));

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "right",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(20);

    document.dir = "";
    document.body.removeAttribute("dir");
    document.body.dir = "rtl";

    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "right",
          "adjacent",
        ),
      ).result.current.left,
    ).toBe(20);
  });

  it("flips above when there is not enough space below", () => {
    vi.stubGlobal("innerHeight", 800);

    vi.mocked(btn.getBoundingClientRect).mockReturnValue(
      rect({ top: 700, bottom: 740, right: 200 }),
    );
    vi.mocked(menu.getBoundingClientRect).mockReturnValue(
      rect({ width: 80, height: 100 }),
    );

    expect(
      renderHook(() =>
        useMenuPosition(true, { current: btn }, { current: menu }),
      ).result.current.top,
    ).toBe(600);
  });

  it("handles width, closed state, and missing refs", () => {
    expect(
      renderHook(() =>
        useMenuPosition(
          true,
          { current: btn },
          { current: menu },
          undefined,
          "right",
          "adjacent",
          false,
        ),
      ).result.current.width,
    ).toBeUndefined();

    expect(
      renderHook(() =>
        useMenuPosition(false, { current: btn }, { current: menu }),
      ).result.current,
    ).toEqual({});

    expect(
      renderHook(() =>
        useMenuPosition(true, { current: null }, { current: null }),
      ).result.current,
    ).toEqual({});
  });
});
