import { useState, useCallback } from "react";
import type { Point } from "@types";

export interface TooltipTargetState {
  id: string;
  element?: HTMLElement | SVGElement;
  virtualCoords?: Point;
}

/**
 * Manages an ephemeral DOM target/anchor for a childless Tooltip portal.
 */
export function useTooltipTarget() {
  const [activeTarget, setActiveTarget] = useState<TooltipTargetState | null>(
    null,
  );

  // Clear the active target, effectively hiding the tooltip
  const clearTarget = useCallback(() => {
    setActiveTarget(null);
  }, []);

  // Register a target element for the tooltip to anchor to
  const registerTarget = useCallback(
    (id: string) => {
      return {
        onMouseEnter: (e: React.MouseEvent<Element>) => {
          setActiveTarget({
            id,
            element: e.currentTarget as HTMLElement | SVGElement,
          });
        },
        onMouseLeave: clearTarget,
      };
    },
    [clearTarget],
  );

  // Register a virtual target for the tooltip to anchor to (used for non-DOM elements)
  const registerVirtualTarget = useCallback(
    (id: string) => {
      return {
        onMouseEnter: (e: React.MouseEvent<Element>) => {
          setActiveTarget({
            id,
            virtualCoords: { x: e.clientX, y: e.clientY },
          });
        },
        onMouseMove: (e: React.MouseEvent<Element>) => {
          setActiveTarget({
            id,
            virtualCoords: { x: e.clientX, y: e.clientY },
          });
        },
        onMouseLeave: clearTarget,
      };
    },
    [clearTarget],
  );

  return {
    activeTarget,
    registerTarget,
    registerVirtualTarget,
    clearTarget,
  };
}
