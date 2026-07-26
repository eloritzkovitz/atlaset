import { useMemo } from "react";
import { useTrips } from "@contexts/TripsContext";
import {
  getVisitColor,
  useMapTheme,
  type ColorMode,
} from "@features/atlas/shared";
import { useHomeCountry } from "@features/user/profile";
import {
  getVisitedCountriesForYear,
  getVisitedCountriesUpToYear,
  getNextUpcomingTripYearByCountry,
} from "@features/visits";
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
  const { homeCountry } = useHomeCountry();
  const { visitColors } = useMapTheme({ mode: colorMode });
  const { trips } = useTrips();

  // Compute timeline layer items based on visit data and selected year
  return useMemo(() => {
    const snapshotCountries = getVisitedCountriesUpToYear(
      trips,
      selectedYear,
      homeCountry,
    );
    const snapshotCountriesPrev = getVisitedCountriesUpToYear(
      trips,
      selectedYear - 1,
      homeCountry,
    );
    const newThisYear = getVisitedCountriesForYear(
      trips,
      selectedYear,
      homeCountry,
    );
    const nextUpcomingYearByCountry = getNextUpcomingTripYearByCountry(trips);

    // Filter active timeline layers and gather all relevant country codes
    const activeLayers = layers.filter((l) => l.visible && l.timelineEnabled);
    const allCountryCodes = Array.from(
      new Set([
        ...activeLayers.flatMap((l) => l.countries || []),
        ...Object.keys(nextUpcomingYearByCountry),
      ]),
    );

    // Generate timeline layer items for each active layer and country code
    return activeLayers.flatMap((layer) =>
      allCountryCodes.map((isoCode) => {
        const count = snapshotCountries[isoCode] || 0;
        const countPrev = snapshotCountriesPrev[isoCode] || 0;
        const isHome = homeCountry === isoCode;

        // Determine if the country is new or a revisit this year
        const isNewThisYear = newThisYear.includes(isoCode);
        const isRevisitThisYear = isNewThisYear && countPrev > 0;

        // Determine if the country is upcoming
        const isUpcoming = nextUpcomingYearByCountry[isoCode] === selectedYear;
        const isUpcomingVisit = isUpcoming && count === 0;
        const isUpcomingRevisit = isUpcoming && count > 0;

        return {
          isoCode: String(isoCode),
          color: getVisitColor(count, isHome, "", colorMode, visitColors, {
            isNewThisYear,
            isRevisitThisYear,
            isUpcomingVisit,
            isUpcomingRevisit,
          }),
          layerId: layer.id,
          count,
        };
      }),
    );
  }, [layers, trips, selectedYear, colorMode, homeCountry, visitColors]);
}
