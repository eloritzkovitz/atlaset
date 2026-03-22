import { render } from "@testing-library/react";
import { useRef } from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import useAutoScrollFocus from "./useAutoScrollFocus";

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
    <div data-testid="container" ref={ref}>
      <button data-seg-value="foo">Foo</button>
    </div>
  );
}

describe("useAutoScrollFocus", () => {
  let scrollSpy: ReturnType<typeof vi.fn>;
  let focusSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollSpy = vi.fn();
    focusSpy = vi.fn();
    (HTMLElement.prototype as any).__orig_scrollIntoView = (
      HTMLElement.prototype as any
    ).scrollIntoView;
    (HTMLElement.prototype as any).__orig_focus = (
      HTMLElement.prototype as any
    ).focus;
    (HTMLElement.prototype as any).scrollIntoView = scrollSpy;
    (HTMLElement.prototype as any).focus = focusSpy;
  });

  afterEach(() => {
    if ((HTMLElement.prototype as any).__orig_scrollIntoView !== undefined) {
      (HTMLElement.prototype as any).scrollIntoView = (
        HTMLElement.prototype as any
      ).__orig_scrollIntoView;
      delete (HTMLElement.prototype as any).__orig_scrollIntoView;
    } else {
      delete (HTMLElement.prototype as any).scrollIntoView;
    }
    if ((HTMLElement.prototype as any).__orig_focus !== undefined) {
      (HTMLElement.prototype as any).focus = (
        HTMLElement.prototype as any
      ).__orig_focus;
      delete (HTMLElement.prototype as any).__orig_focus;
    } else {
      delete (HTMLElement.prototype as any).focus;
    }
    vi.clearAllMocks();
  });

  it("scrolls and focuses the target when present", () => {
    render(<TestHarness selector='[data-seg-value="foo"]' />);
    expect(scrollSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("does nothing when disabled", () => {
    render(<TestHarness selector='[data-seg-value="foo"]' enabled={false} />);
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("does nothing when target not found", () => {
    render(<TestHarness selector='[data-seg-value="missing"]' />);
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("does nothing when selector is null", () => {
    render(<TestHarness selector={null} />);
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("falls back to simple scrollIntoView when initial call throws", () => {
    const fallbackSpy = vi.fn();
    let calls = 0;
    (HTMLElement.prototype as any).scrollIntoView = function () {
      calls += 1;
      if (calls === 1) throw new Error("boom");
      fallbackSpy();
    };

    // normal focus spy
    (HTMLElement.prototype as any).focus = focusSpy;

    render(<TestHarness selector='[data-seg-value="foo"]' />);

    expect(fallbackSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  it("falls back to focus() when focus with options throws", () => {
    const fallbackFocus = vi.fn();
    let focusCalls = 0;
    (HTMLElement.prototype as any).focus = function () {
      focusCalls += 1;
      if (focusCalls === 1) throw new Error("focus boom");
      fallbackFocus();
    };

    (HTMLElement.prototype as any).scrollIntoView = scrollSpy;

    render(<TestHarness selector='[data-seg-value="foo"]' />);

    expect(scrollSpy).toHaveBeenCalled();
    expect(fallbackFocus).toHaveBeenCalled();
  });
});
