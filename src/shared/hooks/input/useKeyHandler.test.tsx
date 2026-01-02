import { render } from "@testing-library/react";
import { useState } from "react";
import type { Key, Modifier } from "@types";
import { useKeyHandler } from "./useKeyHandler";

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
    <input
      data-testid="input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

describe("useKeyHandler", () => {
  beforeEach(() => {
    // Ensure document.activeElement is <body> by default
    (document.body as HTMLElement).focus();
  });

  it("calls handler for matching key", () => {
    const handler = vi.fn();
    render(<TestComponent keys={["a"]} onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("does not call handler for non-matching key", () => {
    const handler = vi.fn();
    render(<TestComponent keys={["a"]} onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "b" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("calls handler for any key if keys is empty", () => {
    const handler = vi.fn();
    render(<TestComponent onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "z" });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("respects modifier keys", () => {
    const handler = vi.fn();
    render(
      <TestComponent keys={["a"]} modifiers={["Ctrl"]} onKey={handler} />
    );
    const event = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    window.dispatchEvent(event);
    expect(handler).toHaveBeenCalledWith(event);

    const event2 = new KeyboardEvent("keydown", { key: "a", ctrlKey: false });
    window.dispatchEvent(event2);
    expect(handler).toHaveBeenCalledTimes(1); // Only first event matches
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    render(<TestComponent keys={["a"]} enabled={false} onKey={handler} />);
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler when focus is on input", () => {
    const handler = vi.fn();
    const { getByTestId } = render(
      <TestComponent keys={["a"]} onKey={handler} />
    );
    const input = getByTestId("input") as HTMLInputElement;
    input.focus();
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not call handler when focus is on textarea", () => {
    const handler = vi.fn();
    render(<TestComponent keys={["a"]} onKey={handler} />);
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    const event = new KeyboardEvent("keydown", { key: "a" });
    window.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(textarea);
  });  
});
