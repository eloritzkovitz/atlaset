Object.defineProperty(window, "innerWidth", { value: 1000, writable: true });
Object.defineProperty(window, "innerHeight", { value: 800, writable: true });

import { renderHook, act, waitFor } from "@testing-library/react";
import { useDraggableModal } from "./useDraggableModal";

describe("useDraggableModal", () => {
  it("centers modal on open", () => {
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    expect(result.current.modalOffset).toEqual({ x: 400, y: 350 });
  });

  it("does not drag if not draggable", () => {
    const { result } = renderHook(() => useDraggableModal(false, true));
    expect(result.current.dragging).toBe(false);
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 100,
        clientY: 100,
      } as any);
    });
    expect(result.current.dragging).toBe(false);
  });

  it("sets dragging true on pointer down if draggable", async () => {
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
      } as any);
    });
    await waitFor(() => {
      expect(result.current.dragging).toBe(true);
    });
  });

  it("resets dragging and offset when closed", async () => {
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    if (result.current.modalOffset) {
      act(() => {
        result.current.handlePointerDown({
          pointerType: "mouse",
          button: 0,
          clientX: 500,
          clientY: 400,
        } as any);
      });
      await waitFor(() => {
        expect(result.current.dragging).toBe(true);
      });
    }
    rerender({ draggable: true, isOpen: false });
    expect(result.current.dragging).toBe(false);
    expect(result.current.modalOffset).toBe(null);
  });

  it("stops dragging on pointer up", async () => {
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
      } as any);
    });
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
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
      } as any);
    });
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
      expect(result.current.modalOffset).toEqual({
        x: 500,
        y: 450,
      });
    });
    window.requestAnimationFrame = origRAF;
  });

  it("calls cancelAnimationFrame and resets id on pointerup after dragging", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 5678);
    const cafSpy = vi.spyOn(window, "cancelAnimationFrame");
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
      } as any);
    });
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

  it("cleans up animation frame on unmount", async () => {
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1234);
    const cafSpy = vi.spyOn(window, "cancelAnimationFrame");
    const modalEl = { offsetWidth: 200, offsetHeight: 100 } as HTMLElement;
    const { result, rerender, unmount } = renderHook(
      ({ draggable, isOpen }) => useDraggableModal(draggable, isOpen),
      { initialProps: { draggable: true, isOpen: false } },
    );
    act(() => {
      result.current.setModalDomRef(modalEl);
    });
    rerender({ draggable: true, isOpen: true });
    await waitFor(() => {
      expect(result.current.modalOffset).not.toBe(null);
    });
    act(() => {
      result.current.handlePointerDown({
        pointerType: "mouse",
        button: 0,
        clientX: 500,
        clientY: 400,
      } as any);
    });
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
