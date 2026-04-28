import { vi } from "vitest";
import { renderHook, act, render } from "@testing-library/react";
import { useRef } from "react";
import type { RefObject } from "react";

function createDivRef(scrollHeight = 1000, clientHeight = 500) {
  const div = document.createElement("div") as HTMLDivElement;
  Object.defineProperty(div, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(div, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
  document.body.appendChild(div);
  return { div, ref: { current: div } as RefObject<HTMLDivElement | null> };
}

describe("useScrollVisibility (condensed)", () => {
  it("DOM-driven flows: mount, scroll, mutation, resize, initialState, null and cleanup", async () => {
    const { useScrollVisibility } = await import("./useScrollVisibility");

    const { div, ref } = createDivRef(1000, 500);
    const { result, unmount } = renderHook(() => useScrollVisibility(ref));
    expect(result.current[1]).toBe(true);

    const onScroll = vi.fn((n) => n);
    const { result: r2, unmount: u2 } = renderHook(() =>
      useScrollVisibility(ref, onScroll),
    );
    act(() => {
      div.scrollTop = 42;
      div.dispatchEvent(new Event("scroll"));
    });
    expect(onScroll).toHaveBeenCalledWith(42);
    expect(r2.current[0]).toBe(42);
    u2();

    const { div: smallDiv, ref: smallRef } = createDivRef(500, 500);
    const { result: r3, unmount: u3 } = renderHook(() =>
      useScrollVisibility(smallRef),
    );
    expect(r3.current[1]).toBe(false);
    await act(async () => {
      Object.defineProperty(smallDiv, "scrollHeight", {
        value: 1000,
        configurable: true,
      });
      smallDiv.textContent = "m";
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(r3.current[1]).toBe(true);
    u3();

    const { div: rdiv, ref: rref } = createDivRef(1000, 1000);
    const { result: r4, unmount: u4 } = renderHook(() =>
      useScrollVisibility(rref),
    );
    expect(r4.current[1]).toBe(false);
    act(() => {
      Object.defineProperty(rdiv, "clientHeight", {
        value: 500,
        configurable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });
    expect(r4.current[1]).toBe(true);
    u4();

    const { ref: ir } = createDivRef();
    const { result: ri, unmount: ui } = renderHook(() =>
      useScrollVisibility(ir, undefined, [], 7),
    );
    expect(ri.current[0]).toBe(7);
    ui();

    const { result: rn } = renderHook(() =>
      useScrollVisibility(
        { current: null } as RefObject<HTMLDivElement | null>,
        undefined,
      ),
    );
    expect(rn.current[1]).toBe(false);

    const { ref: cr } = createDivRef();
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { unmount: ucr } = renderHook(() => useScrollVisibility(cr));
    ucr();
    expect(disconnectSpy).toHaveBeenCalled();
    disconnectSpy.mockRestore();

    unmount();
  });

  it("mocks and helper: invokes internal handlers and helper", async () => {
    vi.resetModules();
    const { ref } = createDivRef(1000, 500);
    vi.doMock("./useMutationObserver", () => ({
      useMutationObserver: (_: any, cb: () => void) => queueMicrotask(cb),
    }));
    vi.doMock("./useEventListener", () => ({
      useEventListener: (
        event: string,
        handler: (e: any) => void,
        target?: any,
      ) => {
        if (event === "scroll") queueMicrotask(() => handler({ target }));
        if (event === "resize")
          queueMicrotask(() => handler({ target: window }));
      },
    }));

    const { useScrollVisibility, isElementScrollable } =
      await import("./useScrollVisibility");
    const onScroll = vi.fn((s) => s);
    const { result, unmount } = renderHook(() =>
      useScrollVisibility(ref, onScroll),
    );
    await act(async () => Promise.resolve());
    expect(onScroll).toHaveBeenCalled();
    expect(result.current[1]).toBe(true);
    expect(isElementScrollable(null)).toBe(false);
    const { div } = createDivRef(1000, 200);
    expect(isElementScrollable(div)).toBe(true);
    unmount();
  });

  it("integration render: mounts element and fires events", async () => {
    const { useScrollVisibility } = await import("./useScrollVisibility");
    function Host({ onScroll }: { onScroll?: (n: number) => unknown }) {
      const ref = useRef<HTMLDivElement | null>(null);
      useScrollVisibility(ref, onScroll);
      return (
        <div>
          <div data-testid="host" ref={ref} />
        </div>
      );
    }
    const onScroll = vi.fn();
    const { getByTestId } = render(<Host onScroll={onScroll} />);
    const el = getByTestId("host") as HTMLDivElement;
    Object.defineProperty(el, "clientHeight", {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(el, "scrollHeight", {
      value: 1000,
      configurable: true,
    });
    await act(async () => {
      el.scrollTop = 10;
      el.dispatchEvent(new Event("scroll"));
    });
    await act(async () => {
      el.textContent = "m";
      await new Promise((r) => setTimeout(r, 20));
    });
    await act(async () => {
      Object.defineProperty(el, "clientHeight", {
        value: 10,
        configurable: true,
      });
      window.dispatchEvent(new Event("resize"));
    });
    expect(onScroll).toHaveBeenCalled();
  });
});
