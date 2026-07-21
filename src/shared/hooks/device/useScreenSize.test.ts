import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as env from "../../utils/env";
import * as eventHook from "../dom/useEventListener";
import { useScreenSize } from "./useScreenSize";

describe("useScreenSize", () => {
  let batteryResolver: ((battery: any) => void) | null = null;

  const mount = (w: number) => {
    window.innerWidth = w;
    return renderHook(() => useScreenSize());
  };

  beforeEach(() => {
    batteryResolver = null;
    Object.defineProperty(navigator, "getBattery", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            batteryResolver = resolve;
          }),
      ),
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([
    [500, false, false, true, false, false, false],
    [800, false, false, false, true, false, false],
    [1200, false, false, false, false, true, false],
    [1920, false, false, false, false, false, true],
    [1920, false, true, false, false, true, false],
    [1920, true, false, false, false, true, false],
  ])(
    "resolves dimensions correctly for width=%i",
    async (w, touch, battery, mobile, tablet, laptop, desktop) => {
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: touch ? 5 : 0,
        configurable: true,
      });

      const { result } = mount(w);

      if (batteryResolver) {
        await act(async () => {
          batteryResolver?.({
            charging: !battery,
            dischargingTime: battery ? 100 : Infinity,
            level: battery ? 0.5 : 1.0,
          });
        });
      }

      expect(result.current.isMobile).toBe(mobile);
      expect(result.current.isTablet).toBe(tablet);
      expect(result.current.isLaptop).toBe(laptop);
      expect(result.current.isDesktop).toBe(desktop);
    },
  );

  it("reacts dynamically to window resize events", () => {
    const { result } = mount(1920);
    expect(result.current.isDesktop).toBe(true);

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(500);
    expect(result.current.isMobile).toBe(true);
  });

  it("removes the resize listener on unmount phase", () => {
    const removeSpy = vi
      .spyOn(window, "removeEventListener")
      .mockImplementation(() => true);
    const { unmount } = mount(1024);
    unmount();
    expect(removeSpy.mock.calls.some((c) => c[0] === "resize")).toBe(true);
  });

  it("handles environment configurations dynamically via useEventListener", () => {
    const spy = vi.spyOn(eventHook, "useEventListener");

    vi.spyOn(env, "isWindowDefined").mockReturnValue(true);
    mount(1920);
    expect(spy).toHaveBeenCalledWith("resize", expect.any(Function), window);

    spy.mockClear();
    vi.spyOn(env, "isWindowDefined").mockReturnValue(false);
    mount(0);
    expect(spy).toHaveBeenCalledWith("resize", expect.any(Function), undefined);
  });
});
