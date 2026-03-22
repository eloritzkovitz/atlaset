import { render } from "@testing-library/react";
import { useRef } from "react";
import { it, describe, expect } from "vitest";
import { useDragScroll } from "./useDragScroll";

function TestHarness() {
  const ref = useRef<HTMLDivElement | null>(null);
  useDragScroll(ref);
  return (
    <div>
      <div
        data-testid="scroll"
        ref={ref}
        style={{ overflowX: "auto", width: 200 }}
      >
        <div style={{ width: 1000 }} />
      </div>
    </div>
  );
}

describe("useDragScroll", () => {
  it("updates scrollLeft on mouse drag", () => {
    const { getByTestId } = render(<TestHarness />);
    const el = getByTestId("scroll") as HTMLDivElement;

    el.scrollLeft = 0;
    window.dispatchEvent(new MouseEvent("mousedown", { clientX: 100 }));
    window.dispatchEvent(new MouseEvent("mousemove", { clientX: 80 }));
    expect(el.scrollLeft).toBeGreaterThanOrEqual(20);
    window.dispatchEvent(new MouseEvent("mouseup"));
  });

  it("updates scrollLeft on touch drag", () => {
    const { getByTestId } = render(<TestHarness />);
    const el = getByTestId("scroll") as HTMLDivElement;
    el.scrollLeft = 0;

    const touchStart = new Event("touchstart") as any;
    Object.defineProperty(touchStart, "touches", {
      value: [{ clientX: 120 }],
    });
    window.dispatchEvent(touchStart);

    const touchMove = new Event("touchmove") as any;
    Object.defineProperty(touchMove, "touches", { value: [{ clientX: 100 }] });
    window.dispatchEvent(touchMove);
    expect(el.scrollLeft).toBeGreaterThanOrEqual(20);

    const touchEnd = new TouchEvent("touchend");
    window.dispatchEvent(touchEnd);
  });

  it("handles mouse move when ref becomes null (no crash)", () => {
    const { getByTestId, unmount } = render(<TestHarness />);
    const el = getByTestId("scroll") as HTMLDivElement;

    el.scrollLeft = 0;
    window.dispatchEvent(new MouseEvent("mousedown", { clientX: 100 }));
    unmount();
    expect(() =>
      window.dispatchEvent(new MouseEvent("mousemove", { clientX: 80 })),
    ).not.toThrow();
    window.dispatchEvent(new MouseEvent("mouseup"));
  });

  it("handles touch move when ref becomes null (no crash)", () => {
    const { getByTestId, unmount } = render(<TestHarness />);
    const el = getByTestId("scroll") as HTMLDivElement;
    el.scrollLeft = 0;
    
    const touchStart = new Event("touchstart") as any;
    Object.defineProperty(touchStart, "touches", { value: [{ clientX: 120 }] });
    window.dispatchEvent(touchStart);
    unmount();

    const touchMove = new Event("touchmove") as any;
    Object.defineProperty(touchMove, "touches", { value: [{ clientX: 100 }] });
    expect(() => window.dispatchEvent(touchMove)).not.toThrow();
    window.dispatchEvent(new Event("touchend"));
  });
});
