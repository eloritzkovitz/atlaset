import { useMemo } from "react";
import { MAP_BG_COLOR } from "@constants/colors";
import { useVisitColorRoles } from "@features/settings";
import { useHomeCountry } from "@features/user";
import { getVisitColor, useVisitedCountriesTimeline } from "@features/visits";
import type { TimelineLayer, LayerMode } from "../types";

export function useTimelineLayerItems(
  layers: TimelineLayer[],
  selectedYear: number,
  layerMode: LayerMode
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

  const palette = useVisitColorRoles(layerMode);

  // Collect all country codes from layers
  const allCountryCodes = Array.from(
    new Set([
      ...layers
        .filter((l) => l.visible && l.timelineEnabled)
        .flatMap((l) => l.countries || []),
      ...Object.keys(nextUpcomingYearByCountry),
    ])
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
              layerMode,
              palette,
              isNewThisYear,
              isRevisitThisYear,
              isUpcomingVisit,
              isUpcomingRevisit
            ),
            layerId: layer.id,
            count,
          };
        })
      );
  }, [
    layers,
    allCountryCodes,
    palette,
    snapshotCountries,
    snapshotCountriesPrev,
    newThisYear,
    selectedYear,
    layerMode,
    homeCountry,
    nextUpcomingYearByCountry,
  ]);
}
