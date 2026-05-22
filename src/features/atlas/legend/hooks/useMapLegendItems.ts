import { MAP_BG_COLOR } from "@constants/colors";
import { COLOR_PALETTES } from "@constants/colorPalettes";
import { useMapView } from "@contexts/MapViewContext";
import type { Layer } from "@features/atlas/layers";
import type { ColorMode } from "@features/atlas/map";
import { useLayerColors, useVisitColorRoles } from "@features/settings";
import type { LegendItem } from "../types";

/**
 * Generates legend items for the map based on current layers and modes
 * @param layers - Array of current layers
 * @param timelineMode - Whether timeline mode is active
 * @param colorMode - Current color mode ("cumulative" or "yearly")
 * @returns Array of legend items for the map
 */
export function useMapLegendItems(
  layers: Layer[],
  timelineMode: boolean,
  colorMode: ColorMode,
): LegendItem[] {
  const { isReadonly, isEdit } = useMapView();

  // Get dynamic color roles for the current mode
  const colorRoles = useVisitColorRoles(colorMode);
  const { colorHomeCountry, colorUpcomingVisits } = useLayerColors();

  // Legend items for static layers
  // Home country legend item (if shown, not readonly/edit)
  const homeCountryLegend: LegendItem[] =
    colorHomeCountry && !isReadonly && !isEdit
      ? [{ color: colorRoles.home, label: "Home country" }]
      : [];

  // Visited countries layer (if present)
  const visitedLayer = layers.find(
    (o) => o.visible && o.name.toLowerCase().includes("visited"),
  );
  const visitedLegend: LegendItem[] = visitedLayer
    ? [{ color: visitedLayer.color, label: visitedLayer.name }]
    : [];

  // Upcoming visit legend item (if shown, not readonly/edit)
  const standardPalette =
    COLOR_PALETTES.find((p) => p.name === "Standard") || COLOR_PALETTES[0];
  const upcomingLegend: LegendItem[] =
    colorUpcomingVisits && !isReadonly && !isEdit
      ? [{ color: standardPalette.colors[3], label: "Upcoming Visit" }]
      : [];

  // Rest of layers (excluding visited)
  const restLayers: LegendItem[] = layers
    .filter((o) => o.visible && (!visitedLayer || o.name !== visitedLayer.name))
    .map((o) => ({ color: o.color, label: o.name }));

  const layerLegendItems: LegendItem[] = [
    ...homeCountryLegend,
    ...visitedLegend,
    ...upcomingLegend,
    ...restLayers,
  ];

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
  if (!timelineMode) return layerLegendItems;
  return colorMode === "cumulative" ? cumulativeLegendItems : yearlyLegendItems;
}
