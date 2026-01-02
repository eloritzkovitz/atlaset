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
    options
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
  it("calls onOutside when clicking outside", () => {
    const { getByTestId } = render(<TestComponent />);
    fireEvent.mouseDown(getByTestId("outside"));
    expect(getByTestId("result").textContent).toBe("outside");
  });

  it("does not call onOutside when clicking inside", () => {
    const { getByTestId } = render(<TestComponent />);
    fireEvent.mouseDown(getByTestId("inside"));
    expect(getByTestId("result").textContent).toBe("inside");
  });

  it("does not call onOutside on scroll inside element", () => {
    const { getByTestId } = render(<TestComponent />);
    fireEvent.scroll(getByTestId("inside"));
    expect(getByTestId("result").textContent).toBe("inside");
  });

  it("calls onOutside on Escape key", () => {
    const { getByTestId } = render(<TestComponent />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(getByTestId("result").textContent).toBe("outside");
  });

  it("calls onOutside on scroll outside element", () => {
    const { getByTestId } = render(
      <TestComponent options={{ scroll: true }} />
    );
    fireEvent.scroll(getByTestId("outside"));
    expect(getByTestId("result").textContent).toBe("outside");
  });

  it("does not call onOutside when disabled", () => {
    const { getByTestId } = render(<TestComponent enabled={false} />);
    fireEvent.mouseDown(getByTestId("outside"));
    expect(getByTestId("result").textContent).toBe("inside");
  });

  it("calls onOutside on window resize when resize option is true", () => {
    const { getByTestId } = render(
      <TestComponent options={{ resize: true }} />
    );
    fireEvent.resize(window);
    expect(getByTestId("result").textContent).toBe("outside");
  });

  it("does not call onOutside on window resize when resize option is false", () => {
    const { getByTestId } = render(
      <TestComponent options={{ resize: false }} />
    );
    fireEvent.resize(window);
    expect(getByTestId("result").textContent).toBe("inside");
  });
});
