import { useMemo } from "react";
import { MAP_BG_COLOR } from "@constants/colors";
import type { ColorMode } from "@features/atlas/map";
import { useVisitColorRoles } from "@features/settings";
import { useHomeCountry } from "@features/user";
import { getVisitColor, useVisitedCountriesTimeline } from "@features/visits";
import type { TimelineLayer } from "../types";

/**
 * Generates timeline layer items with appropriate colors based on visit data and layer settings.
 * @param layers - Array of timeline layers to generate items for
 * @param selectedYear - The currently selected year in the timeline
 * @param colorMode - The current color mode
 * @returns Array of timeline layer items with isoCode, color, layerId, and visit count
 */
export function useTimelineLayerItems(
  layers: TimelineLayer[],
  selectedYear: number,
  colorMode: ColorMode,
) {
  const {
    getVisitedCountriesUpToYear,
    getVisitedCountriesForYear,
    getUpcomingCountries,
  } = useVisitedCountriesTimeline();
  const { homeCountry } = useHomeCountry();
  const snapshotCountries = getVisitedCountriesUpToYear(selectedYear);
  const snapshotCountriesPrev = getVisitedCountriesUpToYear(selectedYear - 1);
  const newThisYear = getVisitedCountriesForYear(selectedYear);
  const nextUpcomingYearByCountry = getUpcomingCountries();

  const palette = useVisitColorRoles(colorMode);

  // Collect all country codes from layers
  const allCountryCodes = Array.from(
    new Set([
      ...layers
        .filter((l) => l.visible && l.timelineEnabled)
        .flatMap((l) => l.countries || []),
      ...Object.keys(nextUpcomingYearByCountry),
    ]),
  );

  return useMemo(() => {
    return layers
      .filter((l) => l.visible && l.timelineEnabled)
      .flatMap((layer) =>
        allCountryCodes.map((isoCode) => {
          const count = snapshotCountries[isoCode] || 0;
          const countPrev = snapshotCountriesPrev[isoCode] || 0;
          const isHome = homeCountry === isoCode;

          // Determine if the country is new or a revisit this year
          const isNewThisYear = newThisYear.includes(isoCode);
          const isRevisitThisYear = isNewThisYear && countPrev > 0;

          // Determine if the country is upcoming
          const isUpcoming =
            nextUpcomingYearByCountry[isoCode] === selectedYear;
          const isUpcomingVisit = isUpcoming && count === 0;
          const isUpcomingRevisit = isUpcoming && count > 0;

          return {
            isoCode: String(isoCode),
            color: getVisitColor(
              count,
              isHome,
              MAP_BG_COLOR,
              colorMode,
              palette,
              isNewThisYear,
              isRevisitThisYear,
              isUpcomingVisit,
              isUpcomingRevisit,
            ),
            layerId: layer.id,
            count,
          };
        }),
      );
  }, [
    layers,
    allCountryCodes,
    palette,
    snapshotCountries,
    snapshotCountriesPrev,
    newThisYear,
    selectedYear,
    colorMode,
    homeCountry,
    nextUpcomingYearByCountry,
  ]);
}
