import { useState } from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, act } from "@testing-library/react";
import { usePendingFocus } from "./usePendingFocus";

function Harness({ initiallyMounted = true }: { initiallyMounted?: boolean }) {
  const { setRef, requestFocus } = usePendingFocus();
  const [mounted, setMounted] = useState(initiallyMounted);

  return (
    <div>
      <button data-testid="req" onClick={() => requestFocus()}>
        Request
      </button>
      <button data-testid="mount" onClick={() => setMounted(true)}>
        Mount
      </button>
      {mounted ? (
        <input data-testid="input" ref={setRef} defaultValue="hello" />
      ) : null}
    </div>
  );
}

describe("usePendingFocus", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("focuses the input when requestFocus is called after mount", () => {
    render(<Harness initiallyMounted={true} />);

    const input = screen.getByTestId("input") as HTMLInputElement;
    input.setSelectionRange(0, 0);

    const btn = screen.getByTestId("req");
    act(() => {
      fireEvent.click(btn);
      vi.runAllTimers();
    });

    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(input.value.length);
  });

  it("focuses the input when requestFocus is called before mount", () => {
    render(<Harness initiallyMounted={false} />);

    const req = screen.getByTestId("req");
    const mount = screen.getByTestId("mount");

    act(() => {
      fireEvent.click(req);
      fireEvent.click(mount);
    });

    const input = screen.getByTestId("input") as HTMLInputElement;
    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(input.value.length);
  });

  it("does not throw when setRef focus throws", () => {
    function BadHarness() {
      const { setRef, requestFocus } = usePendingFocus();
      return (
        <div>
          <button data-testid="req" onClick={() => requestFocus()}>
            Request
          </button>
          <button
            data-testid="badset"
            onClick={() =>
              setRef(
                ({
                  focus() {
                    throw new Error("boom");
                  },
                  value: "x",
                  setSelectionRange() {
                    throw new Error("boom");
                  },
                } as unknown) as HTMLInputElement,
              )
            }
          >
            BadSet
          </button>
        </div>
      );
    }

    render(<BadHarness />);
    const req = screen.getByTestId("req");
    const bad = screen.getByTestId("badset");

    act(() => {
      // mark pending true then call setRef which will throw inside
      fireEvent.click(req);
      fireEvent.click(bad);
    });

    // If exceptions were not caught the test would error; reaching here means catch ran.
    expect(true).toBe(true);
  });

  it("does not throw when requestFocus timer focus throws", () => {
    function CurrHarness() {
      const { inputRef, requestFocus } = usePendingFocus();
      return (
        <div>
          <button
            data-testid="setcurr"
            onClick={() => {
              inputRef.current = ({
                focus() {
                  throw new Error("boom");
                },
                value: "y",
                setSelectionRange() {
                  throw new Error("boom");
                },
              } as unknown) as HTMLInputElement;
            }}
          >
            SetCurr
          </button>
          <button data-testid="req2" onClick={() => requestFocus()}>
            Request2
          </button>
        </div>
      );
    }

    render(<CurrHarness />);
    const setc = screen.getByTestId("setcurr");
    const req2 = screen.getByTestId("req2");

    act(() => {
      fireEvent.click(setc);
      fireEvent.click(req2);
      // run the pending timer
      vi.runAllTimers();
    });

    expect(true).toBe(true);
  });
});
