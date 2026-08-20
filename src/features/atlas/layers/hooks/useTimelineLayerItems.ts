import { useMemo } from "react";
import { getVisitColor, useMapTheme } from "@features/atlas/core";
import type { ColorMode } from "@features/atlas/core/types";
import { useTrips } from "@features/trips";
import { useHomeCountry } from "@features/user/profile";
import {
  getVisitedCountriesForYear,
  getVisitCountsUpToYear,
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
    const visitCounts = getVisitCountsUpToYear(
      trips,
      selectedYear,
      homeCountry,
    );
    const previousVisitCounts = getVisitCountsUpToYear(
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
        const count = visitCounts[isoCode] || 0;
        const countPrev = previousVisitCounts[isoCode] || 0;
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
