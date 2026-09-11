import { fireEvent, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEventListener } from "./useEventListener";

describe("useEventListener", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles events and options", () => {
    const handler = vi.fn();
    const div = document.createElement("div");
    const addSpy = vi.spyOn(div, "addEventListener");

    renderHook(() =>
      useEventListener(["click", "keydown"], handler, div, {
        passive: true,
      }),
    );

    fireEvent.click(div);
    fireEvent.keyDown(div, { key: "Enter" });

    expect(handler).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenCalledWith("click", expect.any(Function), {
      passive: true,
    });
  });

  it("uses the latest handler", () => {
    let count = 0;

    const { rerender } = renderHook(
      ({ handler }) => useEventListener("click", handler, window),
      {
        initialProps: {
          handler: () => {
            count += 1;
          },
        },
      },
    );

    fireEvent.click(window);

    rerender({
      handler: () => {
        count += 10;
      },
    });

    fireEvent.click(window);

    expect(count).toBe(11);
  });

  it("cleans up listeners", () => {
    const handler = vi.fn();
    const div = document.createElement("div");

    const { unmount } = renderHook(() =>
      useEventListener(["click", "keydown"], handler, div),
    );

    unmount();

    fireEvent.click(div);
    fireEvent.keyDown(div);

    expect(handler).not.toHaveBeenCalled();
  });

  it("falls back to window when element is omitted", () => {
    const handler = vi.fn();

    renderHook(() => useEventListener("resize", handler));

    fireEvent(window, new Event("resize"));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("handles null and invalid elements", () => {
    const handler = vi.fn();

    expect(() =>
      renderHook(() => useEventListener("click", handler, null)),
    ).not.toThrow();

    expect(() =>
      renderHook(() => useEventListener("click", handler, {} as EventTarget)),
    ).not.toThrow();
  });
});
