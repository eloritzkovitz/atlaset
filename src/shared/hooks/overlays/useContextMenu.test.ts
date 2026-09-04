import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContextMenu } from "./useContextMenu";
import { useClickOutside } from "../dom/useClickOutside";
import { useKeyHandler } from "../input/useKeyHandler";

vi.mock("../dom/useClickOutside", () => ({ useClickOutside: vi.fn() }));
vi.mock("../input/useKeyHandler", () => ({ useKeyHandler: vi.fn() }));

const STABLE_STYLE = { display: "none" };
const INIT_OPTIONS = { standardMenuStyle: STABLE_STYLE };
const DISABLED_OPTIONS = { disabled: true };
const Z_INDEX_OPTIONS = { zIndex: 500 };

describe("useContextMenu", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    window.innerWidth = 1000;
    window.innerHeight = 1000;
  });

  const createMouseEvent = (clientX: number, clientY: number) =>
    ({
      clientX,
      clientY,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }) as unknown as React.MouseEvent<HTMLElement>;

  it("should initialize with default states and styles", () => {
    const { result } = renderHook(() => useContextMenu(INIT_OPTIONS));

    expect(result.current.open).toBe(false);
    expect(result.current.contextCoords).toBeNull();
    expect(result.current.menuStyle).toEqual(STABLE_STYLE);
  });

  it("should ignore events when disabled", () => {
    const { result } = renderHook(() => useContextMenu(DISABLED_OPTIONS));
    const mockEvent = createMouseEvent(10, 20);

    act(() => {
      result.current.handleContextMenu(mockEvent);
    });

    expect(result.current.open).toBe(false);
  });

  it("should open and calculate coordinates accurately on contextmenu trigger", () => {
    const { result } = renderHook(() => useContextMenu(Z_INDEX_OPTIONS));
    const mockEvent = createMouseEvent(50, 60);

    act(() => {
      result.current.handleContextMenu(mockEvent);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.contextCoords).toEqual({ x: 50, y: 60 });
    expect(result.current.menuStyle).toEqual({
      position: "fixed",
      left: 50,
      top: 60,
      transform: "none",
      zIndex: 500,
    });
  });

  it("should flip the menu coordinates if bounds overflow the viewport", () => {
    const { result } = renderHook(() => useContextMenu());

    result.current.menuRef.current = {
      getBoundingClientRect: () => ({ width: 200, height: 150 }) as DOMRect,
    } as HTMLElement;

    const mockEvent = createMouseEvent(900, 950);
    act(() => {
      result.current.handleContextMenu(mockEvent);
    });

    expect(result.current.menuStyle.left).toBe(700);
    expect(result.current.menuStyle.top).toBe(800);
  });

  it("should enforce the fallback coordinate safety if flipping pushes it off-screen", () => {
    const { result } = renderHook(() => useContextMenu());

    result.current.menuRef.current = {
      getBoundingClientRect: () => ({ width: 1200, height: 1200 }) as DOMRect,
    } as HTMLElement;

    act(() => {
      result.current.openAtCoordinates(900, 950);
    });

    expect(result.current.menuStyle.left).toBe(4);
    expect(result.current.menuStyle.top).toBe(4);
  });

  it("should clear values and fire onClose when closed explicitly", () => {
    const closeOptions = { onClose: mockOnClose };
    const { result } = renderHook(() => useContextMenu(closeOptions));

    act(() => {
      result.current.openAtCoordinates(100, 100);
    });

    act(() => {
      result.current.handleCloseContext();
    });

    expect(result.current.open).toBe(false);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should expose openAtCoordinates via the forwarded ref handle", () => {
    const forwardedRef = React.createRef<any>();
    const refOptions = { forwardedRef };
    const { result } = renderHook(() => useContextMenu(refOptions));

    act(() => {
      forwardedRef.current.openAtCoordinates(15, 30);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.contextCoords).toEqual({ x: 15, y: 30 });
  });

  it("should properly mount layout utility hooks", () => {
    renderHook(() => useContextMenu());

    expect(useClickOutside).toHaveBeenCalled();
    expect(useKeyHandler).toHaveBeenCalled();
  });
});
