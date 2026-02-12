import { renderHook, act } from "@testing-library/react";
import { isWindowDefined, useScreenSize } from "./useScreenSize";

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

describe("useScreenSize", () => {
  beforeEach(() => {
    // Reset window width before each test
    window.innerWidth = 800;
  });

  it("returns isMobile true for width < 768", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(500);
  });

  it("returns isLaptop true for 1024 <= width < 1280", () => {
    window.innerWidth = 1100;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(1100);
  });

  it("returns isDesktop true for width >= 1280", () => {
    window.innerWidth = 1400;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.width).toBe(1400);
  });

  it("returns all false for width between 768 and 1024", () => {
    window.innerWidth = 900;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(900);
  });

  it("updates values when window is resized", () => {
    window.innerWidth = 1400;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isDesktop).toBe(true);

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(500);

    act(() => {
      window.innerWidth = 1100;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(1100);
  });
});
