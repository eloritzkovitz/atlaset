import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDragScroll } from "./useDragScroll";

const dimensions = (scrollWidth: number, clientWidth = 200) => {
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });
};

const mouse = (type: string, clientX = 0) => new MouseEvent(type, { clientX });

const touch = (type: string, clientX = 0) => {
  const event = new Event(type);
  Object.defineProperty(event, "touches", { value: [{ clientX }] });
  return event;
};

describe("useDragScroll", () => {
  it("detects overflow and updates classes", () => {
    dimensions(1000);
    const ref: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };

    const { result, rerender } = renderHook(
      ({ deps }) => useDragScroll(ref, deps),
      { initialProps: { deps: [1000] } },
    );

    expect(result.current.dragClassName).toBe("select-none cursor-grab");

    dimensions(100);
    rerender({ deps: [100] });

    expect(result.current.dragClassName).toBe("cursor-default");
  });

  it("handles a null ref during overflow check", () => {
    const ref: React.RefObject<HTMLElement | null> = { current: null };

    expect(() => renderHook(() => useDragScroll(ref))).not.toThrow();
  });

  it("handles mouse dragging", () => {
    dimensions(1000);
    const ref: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    const { result } = renderHook(() => useDragScroll(ref));

    act(() => ref.current?.dispatchEvent(mouse("mousedown", 100)));
    expect(result.current.isDragging).toBe(true);

    act(() => window.dispatchEvent(mouse("mousemove", 80)));
    expect(ref.current?.scrollLeft).toBe(20);

    act(() => window.dispatchEvent(mouse("mouseup")));
    expect(result.current.isDragging).toBe(false);
  });

  it("handles touch dragging", () => {
    dimensions(1000);
    const ref: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };

    renderHook(() => useDragScroll(ref));

    act(() => ref.current?.dispatchEvent(touch("touchstart", 120)));
    act(() => window.dispatchEvent(touch("touchmove", 100)));

    expect(ref.current?.scrollLeft).toBe(20);

    act(() => window.dispatchEvent(touch("touchend")));
  });

  it("ignores mouse drag without overflow", () => {
    dimensions(100);
    const ref: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    const { result } = renderHook(() => useDragScroll(ref));

    act(() => ref.current?.dispatchEvent(mouse("mousedown", 100)));

    expect(result.current.isDragging).toBe(false);
  });

  it("handles the container disappearing during drag", () => {
    dimensions(1000);

    const mouseRef: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    renderHook(() => useDragScroll(mouseRef));

    act(() => mouseRef.current?.dispatchEvent(mouse("mousedown", 100)));
    mouseRef.current = null;

    expect(() =>
      act(() => window.dispatchEvent(mouse("mousemove", 80))),
    ).not.toThrow();

    const touchRef: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    renderHook(() => useDragScroll(touchRef));

    act(() => touchRef.current?.dispatchEvent(touch("touchstart", 120)));
    touchRef.current = null;

    expect(() =>
      act(() => window.dispatchEvent(touch("touchmove", 100))),
    ).not.toThrow();
  });

  it("cleans up listeners", () => {
    dimensions(1000);
    const ref: React.RefObject<HTMLElement | null> = {
      current: document.createElement("div"),
    };
    const remove = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useDragScroll(ref));

    act(() => ref.current?.dispatchEvent(mouse("mousedown", 100)));
    act(() => window.dispatchEvent(mouse("mouseup")));

    unmount();

    expect(remove).toHaveBeenCalled();
  });
});
