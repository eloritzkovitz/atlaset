import { fireEvent, render } from "@testing-library/react";
import { useRef, useState, type RefObject } from "react";
import { describe, expect, it } from "vitest";
import { useClickOutside } from "./useClickOutside";

type TestOptions = {
  click?: boolean;
  escape?: boolean;
  scroll?: boolean;
  resize?: boolean;
};

function TestComponent({
  enabled = true,
  options = {},
}: {
  enabled?: boolean;
  options?: TestOptions;
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
  const renderComp = (props?: { enabled?: boolean; options?: TestOptions }) =>
    render(<TestComponent {...props} />);

  it.each(["mouseDown", "pointerDown"] as const)(
    "%s triggers only outside",
    (event) => {
      const { getByTestId } = renderComp();

      fireEvent[event](getByTestId("inside"));
      expect(getByTestId("result").textContent).toBe("inside");

      fireEvent[event](getByTestId("outside"));
      expect(getByTestId("result").textContent).toBe("outside");
    },
  );

  it("handles scroll and resize", () => {
    const { getByTestId, unmount } = renderComp({
      options: { scroll: true, resize: true },
    });

    fireEvent.scroll(getByTestId("inside"));
    expect(getByTestId("result").textContent).toBe("inside");

    fireEvent.scroll(getByTestId("outside"));
    expect(getByTestId("result").textContent).toBe("outside");

    unmount();

    const second = renderComp({ options: { resize: true } });

    fireEvent.resize(window);
    expect(second.getByTestId("result").textContent).toBe("outside");

    second.unmount();
  });

  it("handles disabled options", () => {
    const { getByTestId, unmount } = renderComp({
      options: {
        click: false,
        scroll: false,
        resize: false,
        escape: false,
      },
    });

    fireEvent.mouseDown(getByTestId("outside"));
    fireEvent.scroll(window);
    fireEvent.resize(window);
    fireEvent.keyDown(window, { key: "Escape" });

    expect(getByTestId("result").textContent).toBe("inside");

    unmount();

    const disabled = renderComp({ enabled: false });

    fireEvent.mouseDown(disabled.getByTestId("outside"));

    expect(disabled.getByTestId("result").textContent).toBe("inside");
  });

  it("handles Escape and ignores other keys", () => {
    const { getByTestId, unmount } = renderComp();

    fireEvent.keyDown(window, { key: "Enter" });
    expect(getByTestId("result").textContent).toBe("inside");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(getByTestId("result").textContent).toBe("outside");

    unmount();

    const disabled = renderComp({ options: { escape: false } });

    fireEvent.keyDown(window, { key: "Escape" });

    expect(disabled.getByTestId("result").textContent).toBe("inside");
  });
});
