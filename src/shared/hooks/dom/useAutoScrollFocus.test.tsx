import { render } from "@testing-library/react";
import { useRef } from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useAutoScrollFocus } from "./useAutoScrollFocus";

function TestHarness({
  selector,
  enabled = true,
}: {
  selector: string | null;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useAutoScrollFocus(ref, selector, { enabled, centerInline: true });
  return (
    <div ref={ref}>
      <button data-seg-value="foo">Foo</button>
    </div>
  );
}

describe("useAutoScrollFocus", () => {
  let scrollSpy = vi.fn();
  let focusSpy = vi.fn();

  beforeEach(() => {
    scrollSpy = vi.fn();
    focusSpy = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollSpy;
    HTMLElement.prototype.focus = focusSpy;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scrolls and focuses the target element when it is present and enabled", () => {
    render(<TestHarness selector='[data-seg-value="foo"]' />);

    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("does absolutely nothing when disabled", () => {
    render(<TestHarness selector='[data-seg-value="foo"]' enabled={false} />);

    expect(scrollSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("bails out gracefully when the selector is null or element isn't found", () => {
    const { rerender } = render(<TestHarness selector={null} />);
    expect(scrollSpy).not.toHaveBeenCalled();

    rerender(<TestHarness selector='[data-seg-value="missing"]' />);
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
