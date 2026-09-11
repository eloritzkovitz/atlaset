import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as keyboardUtils from "@utils";
import { useKeyHandler } from "./useKeyHandler";

describe("useKeyHandler", () => {
  const handler = vi.fn();

  beforeEach(() => {
    handler.mockClear();
    vi.spyOn(keyboardUtils, "isRestrictedSingleKey").mockReturnValue(false);
    vi.spyOn(keyboardUtils, "isTextInputFocused").mockReturnValue(false);
  });

  afterEach(() => vi.restoreAllMocks());

  const press = (
    target: EventTarget,
    key: string,
    options?: KeyboardEventInit,
  ) => {
    const event = new KeyboardEvent("keydown", { key, ...options });
    act(() => target.dispatchEvent(event));
    return event;
  };

  it("calls handler for matching key and modifiers", () => {
    renderHook(() => useKeyHandler(handler, ["a"], { modifiers: ["Ctrl"] }));

    const event = press(window, "a", { ctrlKey: true });

    expect(handler).toHaveBeenCalledWith(event);
  });

  it("ignores non-matching keys and disabled handlers", () => {
    renderHook(() => useKeyHandler(handler, ["a"], { enabled: false }));
    press(window, "b");

    expect(handler).not.toHaveBeenCalled();
  });

  it("ignores events when text input is focused", () => {
    vi.spyOn(keyboardUtils, "isTextInputFocused").mockReturnValue(true);
    renderHook(() => useKeyHandler(handler, ["a"]));

    press(window, "a");

    expect(handler).not.toHaveBeenCalled();
  });

  it("blocks restricted single-key shortcuts", () => {
    vi.spyOn(keyboardUtils, "isRestrictedSingleKey").mockReturnValue(true);
    renderHook(() => useKeyHandler(handler, ["a"]));

    press(window, "a");

    expect(handler).not.toHaveBeenCalled();
  });

  it("supports a direct target and ref target", () => {
    const target = document.createElement("div");
    const ref = { current: target };

    renderHook(() => useKeyHandler(handler, ["a"], { target }));
    const directEvent = press(target, "a");

    expect(handler).toHaveBeenCalledWith(directEvent);

    handler.mockClear();

    renderHook(() => useKeyHandler(handler, ["a"], { target: ref }));
    const refEvent = press(target, "a");

    expect(handler).toHaveBeenCalledWith(refEvent);
  });

  it("ignores a null target ref", () => {
    renderHook(() =>
      useKeyHandler(handler, ["a"], { target: { current: null } }),
    );

    press(window, "a");

    expect(handler).not.toHaveBeenCalled();
  });

  it("accepts all keys when keys is empty", () => {
    renderHook(() => useKeyHandler(handler));

    const event = press(window, "x");

    expect(handler).toHaveBeenCalledWith(event);
  });

  it("removes the listener on unmount", () => {
    const { unmount } = renderHook(() => useKeyHandler(handler, ["a"]));

    unmount();
    press(window, "a");

    expect(handler).not.toHaveBeenCalled();
  });
});
