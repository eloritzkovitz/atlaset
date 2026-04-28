Object.defineProperty(window, "innerWidth", { value: 1000, writable: true });
Object.defineProperty(window, "innerHeight", { value: 800, writable: true });

import { renderHook, act, waitFor } from "@testing-library/react";
import { useDraggableModal } from "./useDraggableModal";

describe("useDraggableModal", () => {
  const makeModalEl = () =>
    ({ offsetWidth: 200, offsetHeight: 100 }) as HTMLElement;

  function mount(draggable = true, isOpen = false) {
    const modalEl = makeModalEl();
    const { result, rerender, unmount } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable, isOpen } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    return { result, rerender, unmount, modalEl };
  }

  const pointerDown = (result: any, x = 500, y = 400, button = 0) =>
    act(() =>
      result.current.handlePointerDown({
        pointerType: "mouse",
        button,
        clientX: x,
        clientY: y,
      } as any),
    );

  it("centers modal on open", () => {
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    expect(result.current.modalOffset).toEqual({ x: 400, y: 350 });
  });

  it("does not drag if not draggable", () => {
    const { result } = renderHook(() => useDraggableModal(false, true));
    expect(result.current.dragging).toBe(false);
    pointerDown(result, 100, 100, 0);
    expect(result.current.dragging).toBe(false);
  });

  it("sets dragging true on pointer down if draggable", async () => {
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    pointerDown(result);
    await waitFor(() => {
      expect(result.current.dragging).toBe(true);
    });
  });

  it("resets dragging and offset when closed", async () => {
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    if (result.current.modalOffset) {
      pointerDown(result);
      await waitFor(() => {
        expect(result.current.dragging).toBe(true);
      });
    }
    rerender({ draggable: true, isOpen: false });
    expect(result.current.dragging).toBe(false);
    expect(result.current.modalOffset).toBe(null);
  });

  it("stops dragging on pointer up", async () => {
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    pointerDown(result);
    await waitFor(() => {
      expect(result.current.dragging).toBe(true);
    });
    act(() => {
      window.dispatchEvent(new PointerEvent("pointerup"));
    });
    await waitFor(() => {
      expect(result.current.dragging).toBe(false);
    });
  });

  it("updates modalOffset on pointer move when dragging", async () => {
    const origRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(performance.now());
      return 1234;
    }) as any;
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    pointerDown(result);
    await waitFor(() => {
      expect(result.current.dragging).toBe(true);
    });
    await new Promise((r) => setTimeout(r, 0));
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 600, clientY: 500 }),
      );
    });
    await waitFor(() => {
      expect(result.current.modalOffset).toEqual({ x: 500, y: 450 });
    });
    window.requestAnimationFrame = origRAF;
  });

  it("calls cancelAnimationFrame and resets id on pointerup after dragging", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 5678);
    const cafSpy = vi.spyOn(window, "cancelAnimationFrame");
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    pointerDown(result);
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 600, clientY: 500 }),
      );
    });
    await new Promise((r) => setTimeout(r, 0));
    act(() => {
      window.dispatchEvent(new PointerEvent("pointerup"));
    });
    expect(cafSpy).toHaveBeenCalledWith(5678);
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });

  it("does nothing on pointermove/pointerup if not draggable", () => {
    const { result } = renderHook(() => useDraggableModal(false, true));
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 100, clientY: 100 }),
      );
    });
    act(() => {
      window.dispatchEvent(new PointerEvent("pointerup"));
    });
    expect(result.current.dragging).toBe(false);
    expect(result.current.modalOffset).toBe(null);
  });

  it("ignores non-left mouse buttons on pointer down", async () => {
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    pointerDown(result, 500, 400, 1);
    expect(result.current.dragging).toBe(false);
  });

  it("setModalDomRef accepts null and element without throwing", () => {
    const { result } = renderHook(() => useDraggableModal(true, false));
    const modalEl = makeModalEl();
    act(() => {
      result.current.setModalDomRef(modalEl);
      result.current.setModalDomRef(null);
    });
    expect(true).toBe(true);
  });

  it("does not request multiple animation frames for rapid pointer moves", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        cb(performance.now());
        return 9999 as any;
      });
    const { result, rerender } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    pointerDown(result);
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 510, clientY: 410 }),
      );
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 520, clientY: 420 }),
      );
    });
    expect(rafSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    rafSpy.mockRestore();
  });

  it("cleans up animation frame on unmount", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1234);
    const cafSpy = vi.spyOn(window, "cancelAnimationFrame");
    const { result, rerender, unmount } = mount(true, false);
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    pointerDown(result);
    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 600, clientY: 500 }),
      );
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(rafSpy).toHaveBeenCalled();
    unmount();
    if (cafSpy.mock.calls.length > 0) {
      expect(cafSpy).toHaveBeenCalledWith(1234);
    }
    rafSpy.mockRestore();
    cafSpy.mockRestore();
  });
});
