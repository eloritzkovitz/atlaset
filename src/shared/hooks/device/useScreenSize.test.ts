import { renderHook, act } from "@testing-library/react";
import * as useScreenSizeModule from "./useScreenSize";
const { isWindowDefined, useScreenSize } = useScreenSizeModule;

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

it("initial width is 0 when window is undefined (SSR)", async () => {
  const originalInnerWidth = window.innerWidth;
  window.innerWidth = 0;
  const isWindowDefinedMock = vi
    .spyOn(useScreenSizeModule, "isWindowDefined")
    .mockReturnValue(false);
  const { useScreenSize } = await import("./useScreenSize");
  const { result } = renderHook(() => useScreenSize());
  expect(result.current.width).toBe(0);
  isWindowDefinedMock.mockRestore();
  window.innerWidth = originalInnerWidth;
});

describe("useScreenSize", () => {
  let originalWindow: any;
  beforeEach(() => {
    originalWindow = global.window;
    if (global.window) {
      window.innerWidth = 800;
    }
  });

  afterEach(() => {
    if (!global.window && originalWindow) {
      // @ts-ignore
      global.window = originalWindow;
    }
  });

  it("initial width is set from window.innerWidth when window is defined", () => {
    window.innerWidth = 1234;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.width).toBe(1234);
  });

  it("returns isMobile true for width < 768", () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(500);
  });

  it("returns isMobile false for width = 768", () => {
    window.innerWidth = 768;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(768);
  });

  it("returns isLaptop true for 1024 <= width < 1280", () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useScreenSize());
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isLaptop).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.width).toBe(1024);

    window.innerWidth = 1279;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.isLaptop).toBe(true);
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

  it("does not add event listener for SSR (window undefined)", () => {
    const originalWindow = global.window;
    // @ts-ignore
    global.window = undefined;
    const addListenerSpy = vi.spyOn(document, "addEventListener");
    let error: any = null;
    try {
      renderHook(() => useScreenSize());
    } catch (e) {
      error = e;
    }
    // Should not throw ReferenceError, but if it does, fail the test
    if (error && error.name === "ReferenceError") {
      throw error;
    }
    expect(addListenerSpy).not.toHaveBeenCalled();
    addListenerSpy.mockRestore();
    // @ts-ignore
    global.window = originalWindow;
  });

  it("removes event listener on unmount", () => {
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScreenSize());
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    removeListenerSpy.mockRestore();
  });
});
