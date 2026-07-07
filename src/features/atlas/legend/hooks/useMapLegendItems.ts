import { useMapView } from "@contexts/MapViewContext";
import type { Layer } from "@features/atlas/layers";
import { useMapColors } from "@features/atlas/settings";
import { useMapTheme, type ColorMode } from "@features/atlas/shared";
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
  const {
    colorWantToVisitCountries,
    colorHomeCountry,
    colorFutureVisits,
    colorVisitedCountries,
  } = useMapColors();
  const {
    HOME_COUNTRY_COLOR,
    VISITED_COUNTRY_COLOR,
    FUTURE_VISIT_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
    visitColors,
  } = useMapTheme({ mode: colorMode });

  // Determine if legend items can be shown based on map view state
  const canShow = !isReadonly && !isEdit;
  const make = (color: string, label: string) => ({ color, label });

  // Calculate legend items for the tracking layer based on user settings and visibility
  const layerLegendItems: LegendItem[] = [
    ...(colorHomeCountry && canShow
      ? [make(HOME_COUNTRY_COLOR, "Home country")]
      : []),
    ...(colorVisitedCountries && canShow
      ? [make(VISITED_COUNTRY_COLOR, "Visited Countries")]
      : []),
    ...(colorFutureVisits && canShow
      ? [make(FUTURE_VISIT_COUNTRY_COLOR, "Future Visits")]
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
    { color: visitColors.home, label: "Home country" },
    { color: visitColors.visitCounts[4], label: "5+ visits" },
    { color: visitColors.visitCounts[3], label: "4 visits" },
    { color: visitColors.visitCounts[2], label: "3 visits" },
    { color: visitColors.visitCounts[1], label: "2 visits" },
    { color: visitColors.visitCounts[0], label: "1 visit" },
    { color: visitColors.base, label: "Not visited" },
  ];

  // Yearly mode legend items
  const yearlyLegendItems: LegendItem[] = [
    { color: visitColors.home, label: "Home country" },
    { color: visitColors.yearly.upcoming, label: "Upcoming first visit" },
    { color: visitColors.yearly.upcomingRevisit, label: "Upcoming revisit" },
    { color: visitColors.yearly.new, label: "First visit this year" },
    { color: visitColors.yearly.revisit, label: "Revisit this year" },
    { color: visitColors.yearly.previous, label: "Visited in previous years" },
    { color: visitColors.base, label: "Not visited" },
  ];

  // Return appropriate legend items based on mode
  if (!timelineMode) return layerLegendItems;

  return colorMode === "cumulative" ? cumulativeLegendItems : yearlyLegendItems;
}
