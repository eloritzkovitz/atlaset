/**
 * Utility functions for managing overlays.
 */

import type { AnyOverlay, TimelineOverlay } from "@types";

/**
 * Type guard to check if an overlay is a TimelineOverlay.
 * @param overlay - The overlay to check.
 * @returns True if the overlay is a TimelineOverlay, false otherwise.
 */
export function isTimelineOverlay(
  overlay: AnyOverlay
): overlay is TimelineOverlay {
  return (overlay as TimelineOverlay).timelineEnabled === true;
}

/**
 * Generates default overlay selections mapping each overlay ID to "all".
 * @param overlays- The array of overlays.
 * @returns A record mapping overlay IDs to the string "all".
 */
export function getDefaultOverlaySelections(overlays: AnyOverlay[]) {
  return overlays.reduce((acc, overlay) => {
    acc[overlay.id] = "all";
    return acc;
  }, {} as Record<string, string>);
}
