import { vi } from "vitest";
import { fireEvent, renderHook } from "@testing-library/react";
import { useEventListener } from "./useEventListener";

describe("useEventListener", () => {
  it("should call handler on window event", () => {
    const handler = vi.fn();
    renderHook(() => useEventListener("resize", handler, window));
    fireEvent(window, new Event("resize"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should call handler on element event", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    renderHook(() => useEventListener("click", handler, div));
    fireEvent.click(div);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should support an array of event names", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    renderHook(() =>
      useEventListener(["click", "keydown", "touchstart"], handler, div),
    );
    fireEvent.click(div);
    fireEvent.keyDown(div, { key: "Enter" });
    fireEvent.touchStart(div);
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("should pass options to addEventListener", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    const addEventListenerSpy = vi.spyOn(div, "addEventListener");
    renderHook(() =>
      useEventListener("click", handler, div, { passive: true }),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      { passive: true },
    );
    addEventListenerSpy.mockRestore();
  });

  it("should update handler if changed without re-subscribing", () => {
    let count = 0;
    const handler = () => {
      count += 1;
    };
    const { rerender } = renderHook(
      ({ h }) => useEventListener("resize", h, window),
      {
        initialProps: { h: handler },
      },
    );

    fireEvent(window, new Event("resize"));
    expect(count).toBe(1);

    const handler2 = () => {
      count += 10;
    };
    rerender({ h: handler2 });

    fireEvent(window, new Event("resize"));
    expect(count).toBe(11);
  });

  it("should cleanup event listeners on unmount", () => {
    const handler = vi.fn();
    const div = document.createElement("div");

    const { unmount } = renderHook(() =>
      useEventListener(["click", "keydown"], handler, div),
    );

    unmount();

    fireEvent.click(div);
    fireEvent.keyDown(div, { key: "Enter" });

    expect(handler).not.toHaveBeenCalled();
  });

  it("should gracefully handle null or invalid elements without throwing", () => {
    const handler = vi.fn();
    expect(() => {
      renderHook(() => useEventListener("click", handler, null));
    }).not.toThrow();
    expect(() => {
      renderHook(() =>
        useEventListener("click", handler, {} as unknown as EventTarget),
      );
    }).not.toThrow();
  });
});
