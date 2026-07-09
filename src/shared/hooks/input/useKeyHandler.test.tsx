import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { SettingsContext } from "@contexts/SettingsContext";
import type { Key, Modifier } from "@types";
import { useKeyHandler } from "./useKeyHandler";

function renderWithSettings(
  ui: React.ReactElement,
  singleKeyShortcutsEnabled = true,
) {
  const mockContext = {
    settings: {
      accessibility: { singleKeyShortcutsEnabled },
    },
    updateSettings: vi.fn(),
  };

  return render(
    // @ts-expect-error - simple mock matching hook surface area
    <SettingsContext.Provider value={mockContext}>
      {ui}
    </SettingsContext.Provider>,
  );
}

function TestComponent({
  keys,
  enabled = true,
  modifiers = [],
  onKey,
}: {
  keys?: Key[];
  enabled?: boolean;
  modifiers?: Modifier[];
  onKey: (e: KeyboardEvent) => void;
}) {
  useKeyHandler(onKey, keys, enabled, modifiers);
  const [value, setValue] = useState("");
  return (
    <>
      <input
        data-testid="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div data-testid="editable" contentEditable="true" tabIndex={0} />
    </>
  );
}

describe("useKeyHandler", () => {
  beforeEach(() => {
    (document.body as HTMLElement).focus();
  });

  it("calls handler for matching key", () => {
    const handler = vi.fn();
    renderWithSettings(<TestComponent keys={["a"]} onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("does not call handler for non-matching key", () => {
    const handler = vi.fn();
    renderWithSettings(<TestComponent keys={["a"]} onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "b" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("calls handler for any key if keys is empty", () => {
    const handler = vi.fn();
    renderWithSettings(<TestComponent onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "z" });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("respects modifier keys", () => {
    const handler = vi.fn();
    renderWithSettings(
      <TestComponent keys={["a"]} modifiers={["Ctrl"]} onKey={handler} />,
    );
    const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);

    const event2 = new KeyboardEvent("keydown", { key: "a", ctrlKey: false });
    window.dispatchEvent(event2);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    renderWithSettings(
      <TestComponent keys={["a"]} enabled={false} onKey={handler} />,
    );
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler when focus is on input or contenteditable", () => {
    const handler = vi.fn();
    renderWithSettings(<TestComponent keys={["a"]} onKey={handler} />);

    const input = screen.getByTestId("input");
    input.focus();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
    input.blur();

    const fakeEditable = document.createElement("div");
    Object.defineProperty(fakeEditable, "isContentEditable", { value: true });

    const activeElementSpy = vi
      .spyOn(document, "activeElement", "get")
      .mockReturnValue(fakeEditable);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();

    activeElementSpy.mockRestore();
  });

  it("does not call handler when focus is on textarea", () => {
    const handler = vi.fn();
    renderWithSettings(<TestComponent keys={["a"]} onKey={handler} />);
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(textarea);
  });

  describe("when singleKeyShortcutsEnabled is false", () => {
    it("blocks standalone character keys (a-z)", () => {
      const handler = vi.fn();
      renderWithSettings(<TestComponent keys={["c"]} onKey={handler} />, false);

      window.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
      expect(handler).not.toHaveBeenCalled();
    });

    it("allows character keys combined with structural modifiers (e.g., Ctrl+C)", () => {
      const handler = vi.fn();
      renderWithSettings(
        <TestComponent keys={["c"]} modifiers={["Ctrl"]} onKey={handler} />,
        false,
      );

      const event = new KeyboardEvent("keydown", { key: "c", ctrlKey: true });
      window.dispatchEvent(event);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it("allows non-character system keys (e.g., Escape, Enter, ArrowUp)", () => {
      const handler = vi.fn();
      renderWithSettings(
        <TestComponent keys={["Escape"]} onKey={handler} />,
        false,
      );

      const event = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(event);
      expect(handler).toHaveBeenCalledWith(event);
    });
  });
});
