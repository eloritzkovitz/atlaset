import { MAP_BG_COLOR } from "@constants/colors";
import { useVisitColorRoles } from "@features/settings/hooks/useVisitColorRoles";
import type { OverlayMode } from "@types";

export function useMapLegendItems(
  overlays: any[],
  timelineMode: boolean,
  overlayMode: OverlayMode
) {
  // Get dynamic color roles for the current mode
  const colorRoles = useVisitColorRoles(overlayMode);

  // Legend items for static overlays
  const overlayLegendItems = overlays
    .filter((o) => o.visible)
    .map((o) => ({
      color: o.color,
      label: o.name,
    }));

  // Cumulative mode legend items (dynamic)
  const cumulativeLegendItems = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.visitCounts[4], label: "5+ visits" },
    { color: colorRoles.visitCounts[3], label: "4 visits" },
    { color: colorRoles.visitCounts[2], label: "3 visits" },
    { color: colorRoles.visitCounts[1], label: "2 visits" },
    { color: colorRoles.visitCounts[0], label: "1 visit" },
    { color: MAP_BG_COLOR, label: "Not visited" },
  ];

  // Yearly mode legend items (dynamic)
  const yearlyLegendItems = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.yearly.upcoming, label: "Upcoming first visit" },
    { color: colorRoles.yearly.upcomingRevisit, label: "Upcoming revisit" },
    { color: colorRoles.yearly.new, label: "First visit this year" },
    { color: colorRoles.yearly.revisit, label: "Revisit this year" },
    { color: colorRoles.yearly.previous, label: "Visited in previous years" },
    { color: MAP_BG_COLOR, label: "Not visited" },
  ];

  if (!timelineMode) return overlayLegendItems;
  return overlayMode === "cumulative" ? cumulativeLegendItems : yearlyLegendItems;
}
