Object.defineProperty(window, "innerWidth", { value: 1000, writable: true });
Object.defineProperty(window, "innerHeight", { value: 800, writable: true });

import { renderHook, act, waitFor } from "@testing-library/react";
import { usePointerDrag } from "./usePointerDrag";

const makeEl = () => {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetWidth", { value: 200, configurable: true });
  Object.defineProperty(el, "offsetHeight", { value: 100, configurable: true });
  el.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 200,
    }) as DOMRect;
  return el as unknown as HTMLElement;
};
const mount = (dr = true, open = false) => {
  const el = makeEl();
  const { result, rerender, unmount } = renderHook(
    ({ dr, open }) => usePointerDrag(dr, open),
    { initialProps: { dr, open } },
  );
  act(() => result.current.setModalDomRef(el));
  return { result, rerender, unmount, el };
};
const down = (r: any, x = 500, y = 400, b = 0) =>
  act(() =>
    r.current.handlePointerDown({
      pointerType: "mouse",
      button: b,
      clientX: x,
      clientY: y,
    } as any),
  );

describe("usePointerDrag", () => {
  it("centers on open", () => {
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    expect(result.current.modalOffset).toEqual({ x: 400, y: 350 });
  });

  it("centers using getBoundingClientRect for non-HTMLElements", () => {
    const { result, rerender } = mount();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.getBoundingClientRect = () =>
      ({
        width: 300,
        height: 150,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 150,
        right: 300,
      }) as DOMRect;
    act(() => result.current.setModalDomRef(svg as unknown as Element));
    rerender({ dr: true, open: true });
    expect(result.current.modalOffset).toEqual({ x: 350, y: 325 });
  });

  it("no drag if disabled", () => {
    const { result } = renderHook(() => usePointerDrag(false, true));
    down(result, 100, 100);
    expect(result.current.dragging).toBe(false);
  });

  it("starts dragging", async () => {
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    down(result);
    await waitFor(() => expect(result.current.dragging).toBe(true));
  });

  it("resets on close", async () => {
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    await waitFor(() => expect(result.current.modalOffset).not.toBe(null));
    down(result);
    await waitFor(() => expect(result.current.dragging).toBe(true));
    rerender({ dr: true, open: false });
    expect(result.current.dragging).toBe(false);
    expect(result.current.modalOffset).toBe(null);
  });

  it("stops on pointerup", async () => {
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    down(result);
    await waitFor(() => expect(result.current.dragging).toBe(true));
    act(() => window.dispatchEvent(new PointerEvent("pointerup")));
    await waitFor(() => expect(result.current.dragging).toBe(false));
  });

  it("moves on pointermove", async () => {
    const orig = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb: any) => {
      cb(0);
      return 1 as any;
    };
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    down(result);
    await waitFor(() => expect(result.current.dragging).toBe(true));
    act(() =>
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 600, clientY: 500 }),
      ),
    );
    await waitFor(() =>
      expect(result.current.modalOffset).toEqual({ x: 500, y: 450 }),
    );
    window.requestAnimationFrame = orig;
  });

  it("cleans up raf on pointerup", () => {
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockReturnValue(5678 as any);
    const caf = vi.spyOn(window, "cancelAnimationFrame");
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    down(result);
    act(() =>
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 600, clientY: 500 }),
      ),
    );
    act(() => window.dispatchEvent(new PointerEvent("pointerup")));
    expect(caf).toHaveBeenCalledWith(5678);
    raf.mockRestore();
    caf.mockRestore();
  });

  it("ignores non-left buttons", () => {
    const { result, rerender } = mount();
    rerender({ dr: true, open: true });
    down(result, 500, 400, 1);
    expect(result.current.dragging).toBe(false);
  });

  it("setModalDomRef accepts null", () => {
    const { result } = renderHook(() => usePointerDrag(true, false));
    const el = makeEl();
    act(() => {
      result.current.setModalDomRef(el);
      result.current.setModalDomRef(null);
    });
    expect(true).toBe(true);
  });
});
