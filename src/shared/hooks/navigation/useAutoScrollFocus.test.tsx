import { render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAutoScrollFocus } from "./useAutoScrollFocus";

function TestHarness({
  selector,
  enabled = true,
  centerInline = true,
}: {
  selector: string | null;
  enabled?: boolean;
  centerInline?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useAutoScrollFocus(ref, selector, { enabled, centerInline });

  return (
    <div ref={ref}>
      <button data-target="foo">Foo</button>
    </div>
  );
}

describe("useAutoScrollFocus", () => {
  const scrollIntoView = vi.fn();
  const focus = vi.fn();

  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = scrollIntoView;
    HTMLElement.prototype.focus = focus;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("scrolls and focuses the target", () => {
    render(<TestHarness selector='[data-target="foo"]' />);

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("uses nearest inline scrolling when centerInline is false", () => {
    render(<TestHarness selector='[data-target="foo"]' centerInline={false} />);

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  });

  it("does nothing when disabled, selector is null, or target is missing", () => {
    const { rerender } = render(
      <TestHarness selector='[data-target="foo"]' enabled={false} />,
    );

    rerender(<TestHarness selector={null} />);
    rerender(<TestHarness selector='[data-target="missing"]' />);

    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
  });
});
