import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTooltipTarget } from "./useTooltipTarget";

describe("useTooltipTarget", () => {
  it("should initialize with a null active target", () => {
    const { result } = renderHook(() => useTooltipTarget());
    expect(result.current.activeTarget).toBeNull();
  });

  describe("registerTarget (Standard Element Mode)", () => {
    it("should set the active target on mouse enter", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerTarget("test-id");

      const mockElement = document.createElement("button");
      const mockEvent = {
        currentTarget: mockElement,
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(mockEvent);
      });

      expect(result.current.activeTarget).toEqual({
        id: "test-id",
        element: mockElement,
      });
    });

    it("should clear the active target on mouse leave", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerTarget("test-id");

      const mockEvent = {
        currentTarget: document.createElement("button"),
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(mockEvent);
      });
      expect(result.current.activeTarget).not.toBeNull();

      act(() => {
        handlers.onMouseLeave();
      });
      expect(result.current.activeTarget).toBeNull();
    });
  });

  describe("registerVirtualTarget (Coordinate Tracking Mode)", () => {
    it("should capture client coordinates on mouse enter", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerVirtualTarget("virtual-id");

      const mockEvent = {
        clientX: 150,
        clientY: 250,
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(mockEvent);
      });

      expect(result.current.activeTarget).toEqual({
        id: "virtual-id",
        virtualCoords: { x: 150, y: 250 },
      });
    });

    it("should update client coordinates on mouse move", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerVirtualTarget("virtual-id");

      const initialEvent = {
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent<Element>;

      const moveEvent = {
        clientX: 120,
        clientY: 130,
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(initialEvent);
      });

      act(() => {
        handlers.onMouseMove(moveEvent);
      });

      expect(result.current.activeTarget).toEqual({
        id: "virtual-id",
        virtualCoords: { x: 120, y: 130 },
      });
    });

    it("should clear coordinates on mouse leave", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerVirtualTarget("virtual-id");

      const mockEvent = {
        clientX: 100,
        clientY: 100,
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(mockEvent);
      });
      expect(result.current.activeTarget).not.toBeNull();

      act(() => {
        handlers.onMouseLeave();
      });
      expect(result.current.activeTarget).toBeNull();
    });
  });

  describe("clearTarget utility", () => {
    it("should directly nullify activeTarget when called manually", () => {
      const { result } = renderHook(() => useTooltipTarget());
      const handlers = result.current.registerTarget("test-id");

      const mockEvent = {
        currentTarget: document.createElement("div"),
      } as unknown as React.MouseEvent<Element>;

      act(() => {
        handlers.onMouseEnter(mockEvent);
      });
      expect(result.current.activeTarget).not.toBeNull();

      act(() => {
        result.current.clearTarget();
      });
      expect(result.current.activeTarget).toBeNull();
    });
  });

  describe("Reference Stability (useCallback)", () => {
    it("should preserve function identity across re-renders to prevent unnecessary DOM updates", () => {
      const { result, rerender } = renderHook(() => useTooltipTarget());

      const firstRegisterTarget = result.current.registerTarget;
      const firstRegisterVirtualTarget = result.current.registerVirtualTarget;
      const firstClearTarget = result.current.clearTarget;

      act(() => {
        result.current.registerTarget("id").onMouseEnter({
          currentTarget: document.createElement("button"),
        } as unknown as React.MouseEvent<Element>);
      });

      rerender();

      expect(result.current.registerTarget).toBe(firstRegisterTarget);
      expect(result.current.registerVirtualTarget).toBe(
        firstRegisterVirtualTarget,
      );
      expect(result.current.clearTarget).toBe(firstClearTarget);
    });
  });
});
