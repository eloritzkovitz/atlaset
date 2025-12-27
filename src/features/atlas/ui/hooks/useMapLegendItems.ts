import { MAP_BG_COLOR } from "@constants/colors";
import type { Overlay, OverlayMode } from "@features/atlas/overlays";
import { useVisitColorRoles } from "@features/settings/hooks/useVisitColorRoles";
import type { LegendItem } from "../types";

export function useMapLegendItems(
  overlays: Overlay[],
  timelineMode: boolean,
  overlayMode: OverlayMode
): LegendItem[] {
  // Get dynamic color roles for the current mode
  const colorRoles = useVisitColorRoles(overlayMode);

  // Legend items for static overlays
  const overlayLegendItems: LegendItem[] = overlays
    .filter((o) => o.visible)
    .map((o) => ({
      color: o.color,
      label: o.name,
    }));

  // Cumulative mode legend items (dynamic)
  const cumulativeLegendItems: LegendItem[] = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.visitCounts[4], label: "5+ visits" },
    { color: colorRoles.visitCounts[3], label: "4 visits" },
    { color: colorRoles.visitCounts[2], label: "3 visits" },
    { color: colorRoles.visitCounts[1], label: "2 visits" },
    { color: colorRoles.visitCounts[0], label: "1 visit" },
    { color: MAP_BG_COLOR, label: "Not visited" },
  ];

  // Yearly mode legend items (dynamic)
  const yearlyLegendItems: LegendItem[] = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.yearly.upcoming, label: "Upcoming first visit" },
    { color: colorRoles.yearly.upcomingRevisit, label: "Upcoming revisit" },
    { color: colorRoles.yearly.new, label: "First visit this year" },
    { color: colorRoles.yearly.revisit, label: "Revisit this year" },
    { color: colorRoles.yearly.previous, label: "Visited in previous years" },
    { color: MAP_BG_COLOR, label: "Not visited" },
  ];

  // Return appropriate legend items based on mode
  if (!timelineMode) return overlayLegendItems;
  return overlayMode === "cumulative"
    ? cumulativeLegendItems
    : yearlyLegendItems;
}
