import { useRef } from "react";
import { vi } from "vitest";
import { renderHook, act, render } from "@testing-library/react";
import { useTextWidth } from "./useTextWidth";

function TestComponent({ text }: { text: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { measurerRef, suffixLeft } = useTextWidth(text, inputRef);
  return (
    <div>
      <input ref={inputRef} data-testid="input" />
      <span ref={measurerRef as any} data-testid="measurer" />
      <div data-testid="left">{suffixLeft}</div>
    </div>
  );
}

describe("useTextWidth", () => {
  it("returns measurerRef and a numeric suffixLeft", () => {
    const inputRef = { current: document.createElement("input") } as any;
    const { result } = renderHook(() => useTextWidth("hello", inputRef));
    expect(result.current.measurerRef).toBeDefined();
    expect(typeof result.current.suffixLeft).toBe("number");
  });

  it("updates on resize", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    const inputRef = { current: input } as any;
    const { result } = renderHook(() => useTextWidth("test", inputRef));

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(typeof result.current.suffixLeft).toBe("number");
    expect(result.current.suffixLeft).not.toBeNaN();
    document.body.removeChild(input);
  });

  it("computes suffixLeft using measurer width + input paddingLeft (DOM)", () => {
    const origRAF = window.requestAnimationFrame;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(performance.now());
        return 1 as any;
      },
    );

    const { getByTestId } = render(<TestComponent text="hello" />);
    const input = getByTestId("input") as HTMLInputElement;
    const measurer = getByTestId("measurer") as HTMLElement;

    input.style.paddingLeft = "8px";

    measurer.getBoundingClientRect = () => ({
      width: 24,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON() {},
    });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    const left = parseFloat(getByTestId("left").textContent || "0");
    expect(left).toBeCloseTo(32);

    (window.requestAnimationFrame as any).mockRestore();
    window.requestAnimationFrame = origRAF;
  });
});
