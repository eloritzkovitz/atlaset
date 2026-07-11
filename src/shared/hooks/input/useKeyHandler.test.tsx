import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAccessibility } from "@features/settings";
import * as keyboardUtils from "@utils/keyboard";
import { useKeyHandler } from "./useKeyHandler";

vi.mock("@features/settings", () => ({
  useAccessibility: vi.fn(() => ({ singleKeyShortcutsEnabled: true })),
}));

function TestComponent({
  onKey,
  keys = ["a"],
  enabled = true,
  modifiers = [],
}: any) {
  useKeyHandler(onKey, keys, enabled, modifiers);
  return null;
}

describe("useKeyHandler Integration", () => {
  const handler = vi.fn();

  beforeEach(() => {
    handler.mockClear();
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
    vi.mocked(useAccessibility).mockReturnValue({
      singleKeyShortcutsEnabled: false,
    } as any);
    vi.spyOn(keyboardUtils, "isRestrictedSingleKey").mockReturnValue(true);

    render(<TestComponent onKey={handler} keys={["a"]} />);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
  });
});
