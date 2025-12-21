import { useMemo } from "react";
import { getOverlayItems } from "@features/atlas/overlays/utils/overlayRender";
import type { Overlay } from "../types";

/**
 * Retrieves overlay items that are marked as visible.
 * @param overlays - Array of overlay objects.
 * @returns An array of overlay items that are visible.
 */
export function useOverlayItems(overlays: Overlay[]) {
  return useMemo(
    () => overlays.filter((o) => o.visible).flatMap(getOverlayItems),
    [overlays]
  );
}
