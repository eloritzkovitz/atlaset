/**
 * Utilities for overlay rendering.
 */

import { VISITED_OVERLAY_ID } from "@constants/overlays";
import type { Overlay, OverlayItem } from "@types";
import { blendColors } from "@utils/color";

/**
 * Gets overlay items from an overlay definition.
 * @param overlay - The overlay definition containing countries, color, tooltip, and name.
 * @returns Array of overlay items with isoCode, color, and tooltip.
 */
export function getOverlayItems(overlay: Overlay): OverlayItem[] {
  return overlay.countries.map((isoCode) => ({
    isoCode,
    color: overlay.color,
    overlayId: overlay.id,
    tooltip: overlay.tooltip || overlay.name,
  }));
}

/** Groups overlay items by isoCode for blending/stacking.
 * @param overlayItems - The list of overlay items.
 * @returns A record mapping isoCodes to their overlay items.
 */
export function groupOverlayItemsByIsoCode(overlayItems: OverlayItem[] = []) {
  const overlayGroups: Record<string, OverlayItem[]> = {};
  for (const item of overlayItems) {
    const code = (item.isoCode || "").toUpperCase();
    if (!code) continue;
    if (!overlayGroups[code]) overlayGroups[code] = [];
    overlayGroups[code].push(item);
  }
  return overlayGroups;
}

/** Returns a blended color for a list of overlay items.
 * If no overlay colors, returns the fallback color.
 * @param overlays - The overlay items for a country.
 * @param fallbackColor - The color to return if no overlays.
 * @returns The blended color or fallback color.
 */
export function getBlendedOverlayColor(
  overlays: OverlayItem[] = [],
  fallbackColor?: string
) {
  // Prioritize visited-countries overlay
  const visited = overlays.find(o => o.overlayId === VISITED_OVERLAY_ID);
  if (visited) return visited.color;

  // Otherwise, blend or pick the top-most overlay
  const overlayColors = overlays
    .map((o) => o.color)
    .filter((c): c is string => typeof c === "string" && c.length > 0);

  if (overlayColors.length === 0) return fallbackColor;
  if (overlayColors.length === 1) return overlayColors[0];

  // preserve stacking order by reversing
  return blendColors([...overlayColors].reverse());
}
