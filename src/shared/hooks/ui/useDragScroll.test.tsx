import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { it, describe, expect, beforeEach } from "vitest";
import { useDragScroll } from "./useDragScroll";

function TestHarness({ dependencies = [] }: { dependencies?: unknown[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { dragClassName, isDragging, isOverflowing } = useDragScroll(
    ref,
    dependencies,
  );

  return (
    <div
      data-testid="scroll"
      ref={ref}
      className={dragClassName}
      data-dragging={isDragging}
      data-overflowing={isOverflowing}
    />
  );
}

// Mock the dimensions of the scrollable container
const setMockDimensions = (scrollWidth: number, clientWidth = 200) => {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    value: clientWidth,
  });
  Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
    configurable: true,
    value: scrollWidth,
  });
};

// Helper function to dispatch touch events
const dispatchTouch = (type: string, target: EventTarget, clientX: number) => {
  const event = new Event(type, { bubbles: true });
  Object.defineProperty(event, "touches", { value: [{ clientX }] });
  target.dispatchEvent(event);
};

describe("useDragScroll", () => {
  beforeEach(() => setMockDimensions(1000));

  it("calculates overflow states and applies corresponding cursors", () => {
    const { getByTestId, rerender } = render(
      <TestHarness dependencies={[1000]} />,
    );
    expect(getByTestId("scroll").className).toContain("cursor-grab");

    setMockDimensions(150);

    act(() => {
      rerender(<TestHarness dependencies={[150]} />);
    });
    expect(getByTestId("scroll").className).toContain("cursor-default");
  });

  it("updates scrollLeft and style classes on mouse drag workflows", () => {
    const el = render(<TestHarness />).getByTestId("scroll") as HTMLDivElement;

    act(() => {
      el.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 100, bubbles: true }),
      );
    });
    expect(el.className).toContain("cursor-grabbing");
    expect(el.getAttribute("data-dragging")).toBe("true");

    act(() => {
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 80 }));
    });
    expect(el.scrollLeft).toBe(20);

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseup"));
    });
    expect(el.className).toContain("cursor-grab");
  });

  it("updates scrollLeft on mobile touch workflows", () => {
    const el = render(<TestHarness />).getByTestId("scroll") as HTMLDivElement;
    dispatchTouch("touchstart", el, 120);
    dispatchTouch("touchmove", window, 100);
    expect(el.scrollLeft).toBe(20);
    dispatchTouch("touchend", window, 100);
  });

  it("handles event streams safely when container unmounts mid-action", () => {
    const mouseHarness = render(<TestHarness />);
    mouseHarness
      .getByTestId("scroll")
      .dispatchEvent(
        new MouseEvent("mousedown", { clientX: 100, bubbles: true }),
      );
    mouseHarness.unmount();
    expect(() =>
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 80 })),
    ).not.toThrow();

    const touchHarness = render(<TestHarness />);
    dispatchTouch("touchstart", touchHarness.getByTestId("scroll"), 120);
    touchHarness.unmount();
    expect(() => dispatchTouch("touchmove", window, 100)).not.toThrow();
  });
});
