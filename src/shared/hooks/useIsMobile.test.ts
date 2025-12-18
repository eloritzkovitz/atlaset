import { renderHook, act } from "@testing-library/react";
import { isWindowDefined, useIsMobile } from "./useIsMobile";

describe("isWindowDefined", () => {
  it("returns true when window is defined", () => {
    expect(isWindowDefined()).toBe(true);
  });

  it("returns false when window is undefined", () => {
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;
    expect(isWindowDefined()).toBe(false);
    // @ts-ignore
    global.window = originalWindow;
  });
});

describe("useIsMobile", () => {
  it("returns true when window.innerWidth < breakpoint", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(true);
  });

  it("returns false when window.innerWidth >= breakpoint", () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);
  });

  it("updates when window is resized", () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile(768));
    expect(result.current).toBe(false);

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(true);
  });
});
