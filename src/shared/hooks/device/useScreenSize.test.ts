import { renderHook, act, waitFor } from "@testing-library/react";
import * as env from "../../utils/env";
import * as eventHook from "../dom/useEventListener";
import { useScreenSize } from "./useScreenSize";

describe("useScreenSize — condensed", () => {
  const mount = (w: number) => {
    window.innerWidth = w;
    return renderHook(() => useScreenSize());
  };

  afterEach(() => vi.restoreAllMocks());

  it.each([
    [500, true, false, false],
    [768, false, false, false],
    [900, false, false, false],
    [1024, false, true, false],
    [1279, false, true, false],
    [1400, false, false, true],
  ])(
    "breakpoints: width=%i -> isMobile=%s isLaptop=%s isDesktop=%s",
    (width, isMobile, isLaptop, isDesktop) => {
      const { result } = mount(width as number);
      expect(result.current.width).toBe(width);
      expect(result.current.isMobile).toBe(isMobile as boolean);
      expect(result.current.isLaptop).toBe(isLaptop as boolean);
      expect(result.current.isDesktop).toBe(isDesktop as boolean);
    },
  );

  it("reacts to resize events and updates categories", async () => {
    const { result } = mount(1400);
    expect(result.current.isDesktop).toBe(true);

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      expect(result.current.isMobile).toBe(true);
      expect(result.current.width).toBe(500);
    });

    act(() => {
      window.innerWidth = 1100;
      window.dispatchEvent(new Event("resize"));
    });

    await waitFor(() => {
      expect(result.current.isLaptop).toBe(true);
      expect(result.current.width).toBe(1100);
    });
  });

  it("removes resize listener on unmount", () => {
    const removeSpy = vi
      .spyOn(window, "removeEventListener")
      .mockImplementation(() => true);
    const { unmount } = mount(800);
    unmount();
    expect(
      removeSpy.mock.calls.some(
        (c) => c[0] === "resize" && typeof c[1] === "function",
      ),
    ).toBe(true);
  });

  it("does not add document listener when window is undefined (SSR)", async () => {
    const original = (global as any).window;
    try {
      // @ts-ignore
      delete (global as any).window;
      vi.resetModules();
      const addSpy = vi
        .spyOn(document, "addEventListener")
        .mockImplementation(() => true);
      await import("./useScreenSize");
      expect(addSpy).not.toHaveBeenCalled();
    } finally {
      (global as any).window = original;
    }
  });

  it("passes window or undefined into useEventListener based on env.isWindowDefined", () => {
    const spy = vi.spyOn(eventHook, "useEventListener");

    vi.spyOn(env, "isWindowDefined").mockReturnValue(true);
    mount(800);
    expect(spy).toHaveBeenCalledWith("resize", expect.any(Function), window);

    spy.mockClear();
    vi.spyOn(env, "isWindowDefined").mockReturnValue(false);
    mount(0);
    expect(spy).toHaveBeenCalledWith("resize", expect.any(Function), undefined);
  });
});
