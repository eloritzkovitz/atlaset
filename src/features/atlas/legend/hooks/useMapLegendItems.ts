import { useMapView } from "@contexts/MapViewContext";
import type { Layer } from "@features/atlas/layers";
import type { ColorMode } from "@features/atlas/map";
import {
  useCountryColors,
  useLayerColors,
  useVisitColorRoles,
} from "@features/settings";
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
  const {
    colorWantToVisitCountries,
    colorHomeCountry,
    colorUpcomingVisits,
    colorVisitedCountries,
  } = useLayerColors();
  const {
    VISITED_COUNTRY_COLOR,
    UPCOMING_VISIT_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
  } = useCountryColors();

  const canShow = !isReadonly && !isEdit;
  const make = (color: string, label: string) => ({ color, label });

  // Static layer-based legend items (only in non-timeline mode)
  const layerLegendItems: LegendItem[] = [
    ...(colorHomeCountry && canShow
      ? [make(colorRoles.home, "Home country")]
      : []),
    ...(colorVisitedCountries && canShow
      ? [make(VISITED_COUNTRY_COLOR, "Visited Countries")]
      : []),
    ...(colorUpcomingVisits && canShow
      ? [make(UPCOMING_VISIT_COUNTRY_COLOR, "Upcoming Visits")]
      : []),
    ...(colorWantToVisitCountries && canShow
      ? [make(SELECTED_COUNTRY_COLOR, "Want to Visit")]
      : []),
    ...layers
      .filter((o) => o.visible && !o.name.toLowerCase().includes("visited"))
      .map((o) => make(o.color, o.name)),
  ];

  // Cumulative mode legend items
  const cumulativeLegendItems: LegendItem[] = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.visitCounts[4], label: "5+ visits" },
    { color: colorRoles.visitCounts[3], label: "4 visits" },
    { color: colorRoles.visitCounts[2], label: "3 visits" },
    { color: colorRoles.visitCounts[1], label: "2 visits" },
    { color: colorRoles.visitCounts[0], label: "1 visit" },
    { color: colorRoles.base, label: "Not visited" },
  ];

  // Yearly mode legend items
  const yearlyLegendItems: LegendItem[] = [
    { color: colorRoles.home, label: "Home country" },
    { color: colorRoles.yearly.upcoming, label: "Upcoming first visit" },
    { color: colorRoles.yearly.upcomingRevisit, label: "Upcoming revisit" },
    { color: colorRoles.yearly.new, label: "First visit this year" },
    { color: colorRoles.yearly.revisit, label: "Revisit this year" },
    { color: colorRoles.yearly.previous, label: "Visited in previous years" },
    { color: colorRoles.base, label: "Not visited" },
  ];

  // Return appropriate legend items based on mode
  if (!timelineMode) return layerLegendItems;
  return colorMode === "cumulative" ? cumulativeLegendItems : yearlyLegendItems;
}
