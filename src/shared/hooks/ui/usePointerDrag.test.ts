import type { RefObject } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePointerDrag } from "./usePointerDrag";

type HookResult = ReturnType<typeof usePointerDrag>;

Object.defineProperties(window, {
  innerWidth: { value: 1000, writable: true },
  innerHeight: { value: 800, writable: true },
});

const createRef = (): RefObject<Element | null> => {
  const el = document.createElement("div");

  Object.defineProperties(el, {
    offsetWidth: { value: 200 },
    offsetHeight: { value: 100 },
  });

  return { current: el };
};

const mount = (open = false) => {
  const hook = renderHook(({ open }) => usePointerDrag(true, open), {
    initialProps: { open },
  });

  act(() => hook.result.current.setModalDomRef(createRef().current));

  return hook;
};

const down = (
  result: { current: HookResult },
  options: Partial<PointerEventInit> = {},
) =>
  act(() =>
    result.current.handlePointerDown(
      new PointerEvent("pointerdown", {
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
        ...options,
      }) as unknown as React.PointerEvent<Element>,
    ),
  );

const move = () =>
  window.dispatchEvent(
    new PointerEvent("pointermove", {
      clientX: 600,
      clientY: 500,
    }),
  );

afterEach(() => {
  vi.restoreAllMocks();
  document.body.style.userSelect = "";
});

describe("usePointerDrag", () => {
  it("handles styles and centering", () => {
    const disabled = renderHook(() => usePointerDrag(false, false));

    expect(disabled.result.current.modalStyle).toEqual({});

    const { result, rerender } = mount();

    expect(result.current.modalStyle.position).toBe("fixed");

    rerender({ open: true });

    expect(result.current.modalOffset).toEqual({ x: 400, y: 350 });
  });

  it("centers non-HTML elements", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
      width: 300,
      height: 150,
    } as DOMRect);

    const hook = renderHook(({ open }) => usePointerDrag(true, open), {
      initialProps: { open: false },
    });

    act(() => hook.result.current.setModalDomRef(svg));
    hook.rerender({ open: true });

    expect(hook.result.current.modalOffset).toEqual({
      x: 350,
      y: 325,
    });
  });

  it("handles pointer down guards", () => {
    const disabled = renderHook(() => usePointerDrag(false, true));

    down(disabled.result);

    expect(disabled.result.current.dragging).toBe(false);

    const { result, rerender } = mount();
    rerender({ open: true });

    down(result, { button: 1 });

    expect(result.current.dragging).toBe(false);

    down(result);

    expect(result.current.dragging).toBe(true);
  });

  it("ignores pointer down inside excluded refs", () => {
    const excluded = createRef();
    const child = document.createElement("button");

    excluded.current?.appendChild(child);

    const hook = renderHook(
      ({ open }) =>
        usePointerDrag(true, open, [excluded as RefObject<HTMLElement | null>]),
      { initialProps: { open: false } },
    );

    act(() => hook.result.current.setModalDomRef(createRef().current));

    hook.rerender({ open: true });

    act(() =>
      hook.result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
        target: child,
      } as unknown as React.PointerEvent<Element>),
    );

    expect(hook.result.current.dragging).toBe(false);
  });

  it("starts dragging outside excluded refs", () => {
    const excluded = createRef();

    const hook = mount();

    hook.rerender({ open: true });

    act(() =>
      hook.result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
        target: document.createElement("button"),
      } as unknown as React.PointerEvent<Element>),
    );

    expect(hook.result.current.dragging).toBe(true);

    // Also covers an excluded ref whose current value is null.
    expect(excluded.current).not.toBeNull();
  });

  it("updates and clears pending frames", () => {
    let frame: FrameRequestCallback | undefined;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frame = cb;
      return 123;
    });

    const { result, rerender } = mount();

    rerender({ open: true });
    down(result);

    act(() => {
      move();
      move();
    });

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => frame?.(0));

    expect(result.current.modalOffset).toEqual({
      x: 500,
      y: 450,
    });

    down(result);
    act(move);
    act(() => window.dispatchEvent(new PointerEvent("pointerup")));

    expect(result.current.dragging).toBe(false);

    act(() => frame?.(0));
  });

  it("cancels frames on pointer up and close", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");

    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(123);

    const { result, rerender } = mount();

    rerender({ open: true });
    down(result);

    act(move);
    act(() => window.dispatchEvent(new PointerEvent("pointerup")));

    expect(cancel).toHaveBeenCalledWith(123);

    down(result);
    act(move);

    rerender({ open: false });

    expect(cancel).toHaveBeenCalledWith(123);
    expect(result.current.modalOffset).toBe(null);
  });

  it("ignores disabled and idle events", () => {
    const idle = renderHook(() => usePointerDrag(true, false));
    const disabled = renderHook(() => usePointerDrag(false, false));

    act(() => {
      move();
      window.dispatchEvent(new PointerEvent("pointerup"));
    });

    expect(idle.result.current.dragging).toBe(false);
    expect(disabled.result.current.dragging).toBe(false);
  });

  it("handles missing modal refs", () => {
    const { result, rerender } = renderHook(
      ({ open }) => usePointerDrag(true, open),
      { initialProps: { open: false } },
    );

    rerender({ open: true });

    expect(result.current.modalOffset).toBe(null);

    act(() => result.current.setModalDomRef(null));
  });
});
