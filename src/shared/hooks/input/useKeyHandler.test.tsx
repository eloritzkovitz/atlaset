import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as keyboardUtils from "@utils/keyboard";
import { useKeyHandler } from "./useKeyHandler";

function TestComponent({
  onKey,
  keys = ["a"],
  enabled = true,
  modifiers = [],
  allowSingleKeyShortcuts = true,
  target,
}: any) {
  useKeyHandler(onKey, keys, {
    enabled,
    modifiers,
    allowSingleKeyShortcuts,
    target,
  });
  return null;
}

describe("useKeyHandler Integration", () => {
  const handler = vi.fn();

  beforeEach(() => {
    handler.mockClear();
    vi.spyOn(keyboardUtils, "isRestrictedSingleKey").mockReturnValue(false);
    vi.spyOn(keyboardUtils, "isTextInputFocused").mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("binds events and executes handler when matches succeed", () => {
    render(<TestComponent onKey={handler} keys={["a"]} modifiers={["Ctrl"]} />);

    const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it("removes event listener on unmount", () => {
    const { unmount } = render(<TestComponent onKey={handler} keys={["a"]} />);
    unmount();

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not register listeners when enabled prop is false", () => {
    render(<TestComponent onKey={handler} enabled={false} />);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("bails early if text input fields are focused", () => {
    vi.spyOn(keyboardUtils, "isTextInputFocused").mockReturnValue(true);
    render(<TestComponent onKey={handler} keys={["a"]} />);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("blocks shortcuts if utility classifies key as a restricted single key", () => {
    vi.spyOn(keyboardUtils, "isRestrictedSingleKey").mockReturnValue(true);

    render(
      <TestComponent
        onKey={handler}
        keys={["a"]}
        allowSingleKeyShortcuts={false}
      />,
    );

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
  });
});
