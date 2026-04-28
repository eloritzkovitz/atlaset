import { render, fireEvent } from "@testing-library/react";
import { useRef, useState, type RefObject } from "react";
import { useClickOutside } from "./useClickOutside";

function TestComponent({
  enabled = true,
  options = {},
}: {
  enabled?: boolean;
  options?: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [outside, setOutside] = useState(false);
  useClickOutside(
    [ref as RefObject<HTMLElement>],
    () => setOutside(true),
    enabled,
    options,
  );
  return (
    <div>
      <div data-testid="inside" ref={ref}>
        Inside
      </div>
      <div data-testid="outside">Outside</div>
      <div data-testid="result">{outside ? "outside" : "inside"}</div>
    </div>
  );
}

describe("useClickOutside", () => {
  const renderComp = (props: any = {}) => render(<TestComponent {...props} />);

  it.each(["mousedown", "pointerdown"])(
    "%s: inside vs outside",
    (eventType) => {
      const { getByTestId } = renderComp();
      const eventMap: Record<string, keyof typeof fireEvent> = {
        mousedown: "mouseDown",
        pointerdown: "pointerDown",
      };
      const fn = fireEvent[eventMap[eventType]] as (el: Element) => void;
      fn(getByTestId("inside"));
      expect(getByTestId("result").textContent).toBe("inside");
      fn(getByTestId("outside"));
      expect(getByTestId("result").textContent).toBe("outside");
    },
  );

  it("scroll behavior: default disabled, enabled true", () => {
    const d1 = renderComp();
    fireEvent.scroll(d1.getByTestId("outside"));
    expect(d1.getByTestId("result").textContent).toBe("inside");
    d1.unmount();

    const d2 = renderComp({ options: { scroll: true } });
    fireEvent.scroll(d2.getByTestId("outside"));
    expect(d2.getByTestId("result").textContent).toBe("outside");
    d2.unmount();
  });

  it("resize behavior: enabled vs disabled", () => {
    const r1 = renderComp({ options: { resize: true } });
    fireEvent.resize(window);
    expect(r1.getByTestId("result").textContent).toBe("outside");
    r1.unmount();

    const r2 = renderComp({ options: { resize: false } });
    fireEvent.resize(window);
    expect(r2.getByTestId("result").textContent).toBe("inside");
    r2.unmount();
  });

  it("Escape key and escape option", () => {
    const d = renderComp();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(d.getByTestId("result").textContent).toBe("outside");
    d.unmount();

    const d2 = renderComp({ options: { escape: false } });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(d2.getByTestId("result").textContent).toBe("inside");
    d2.unmount();
  });

  it("does not call when disabled", () => {
    const { getByTestId } = renderComp({ enabled: false });
    fireEvent.mouseDown(getByTestId("outside"));
    expect(getByTestId("result").textContent).toBe("inside");
  });

  it("scroll on window triggers when scroll option is true", () => {
    const d = renderComp({ options: { scroll: true } });
    fireEvent.scroll(window);
    expect(d.getByTestId("result").textContent).toBe("outside");
    d.unmount();
  });

  it("keydown non-Escape does not trigger onOutside", () => {
    const d = renderComp();
    fireEvent.keyDown(window, { key: "Enter" });
    expect(d.getByTestId("result").textContent).toBe("inside");
    d.unmount();
  });
});
