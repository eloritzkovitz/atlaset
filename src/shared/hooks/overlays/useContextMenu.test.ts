import React from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useContextMenu } from "./useContextMenu";

vi.mock("../dom/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

vi.mock("../input/useKeyHandler", () => ({
  useKeyHandler: vi.fn(),
}));

const STABLE_STYLE = { display: "none" };

describe("useContextMenu", () => {
  beforeEach(() => {
    window.innerWidth = 1000;
    window.innerHeight = 1000;
  });

  const event = (x: number, y: number) =>
    ({
      clientX: x,
      clientY: y,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    }) as unknown as React.MouseEvent<HTMLElement>;

  it("initializes and uses the standard style", () => {
    const { result } = renderHook(() =>
      useContextMenu({ standardMenuStyle: STABLE_STYLE }),
    );

    expect(result.current.open).toBe(false);
    expect(result.current.contextCoords).toBeNull();
    expect(result.current.menuStyle).toEqual(STABLE_STYLE);
  });

  it("opens at the cursor and ignores disabled menus", () => {
    const { result: disabled } = renderHook(() =>
      useContextMenu({ disabled: true }),
    );

    act(() => disabled.current.handleContextMenu(event(10, 20)));

    expect(disabled.current.open).toBe(false);

    const { result } = renderHook(() => useContextMenu({ zIndex: 500 }));

    const e = event(50, 60);

    act(() => result.current.handleContextMenu(e));

    expect(e.preventDefault).toHaveBeenCalled();
    expect(e.stopPropagation).toHaveBeenCalled();
    expect(result.current.contextCoords).toEqual({ x: 50, y: 60 });
    expect(result.current.menuStyle).toEqual({
      position: "fixed",
      left: 50,
      top: 60,
      transform: "none",
      zIndex: 500,
    });
  });

  it("positions the menu within the viewport", () => {
    const { result } = renderHook(() => useContextMenu());

    act(() => result.current.openAtCoordinates(100, 100));

    expect(result.current.menuStyle.left).toBe(100);
    expect(result.current.menuStyle.top).toBe(100);

    result.current.menuRef.current = {
      getBoundingClientRect: () => ({
        width: 200,
        height: 150,
      }),
    } as HTMLElement;

    act(() => result.current.openAtCoordinates(900, 950));

    expect(result.current.menuStyle.left).toBe(700);
    expect(result.current.menuStyle.top).toBe(800);

    result.current.menuRef.current = {
      getBoundingClientRect: () => ({
        width: 1200,
        height: 100,
      }),
    } as HTMLElement;

    act(() => result.current.openAtCoordinates(900, 100));

    expect(result.current.menuStyle.left).toBe(4);
    expect(result.current.menuStyle.top).toBe(100);

    result.current.menuRef.current = {
      getBoundingClientRect: () => ({
        width: 100,
        height: 1200,
      }),
    } as HTMLElement;

    act(() => result.current.openAtCoordinates(100, 900));

    expect(result.current.menuStyle.left).toBe(100);
    expect(result.current.menuStyle.top).toBe(4);
  });

  it("closes and calls onClose", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useContextMenu({ onClose }));

    act(() => result.current.openAtCoordinates(100, 100));
    act(() => result.current.handleCloseContext());

    expect(result.current.open).toBe(false);
    expect(result.current.contextCoords).toBeNull();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("exposes imperative opening through forwardedRef", () => {
    const forwardedRef = React.createRef<{
      openAtCoordinates: (x: number, y: number) => void;
    }>();

    const { result } = renderHook(() =>
      useContextMenu({
        forwardedRef: forwardedRef as React.Ref<unknown>,
      }),
    );

    act(() => {
      forwardedRef.current?.openAtCoordinates(15, 30);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.contextCoords).toEqual({ x: 15, y: 30 });
  });
});
