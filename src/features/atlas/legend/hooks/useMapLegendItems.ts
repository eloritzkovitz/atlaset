import { useTranslation } from "react-i18next";
import { useMapTheme } from "@features/atlas/core";
import type { ColorMode } from "@features/atlas/core/types";
import type { Layer } from "@features/atlas/layers/types";
import { useMapView } from "@features/atlas/map";
import { useMapOverlays } from "@features/atlas/settings";
import type { LegendItem } from "../types";

/**
 * Generates legend items for the map based on current layers and modes.
 * @param layers - Array of current layers.
 * @param timelineMode - Whether timeline mode is active.
 * @param colorMode - Current color mode ("cumulative" or "yearly").
 * @returns Array of legend items for the map.
 */
export function useMapLegendItems(
  layers: Layer[],
  timelineMode: boolean,
  colorMode: ColorMode,
): LegendItem[] {
  const { isReadonly, isEdit } = useMapView();
  const {
    showWantToVisitCountries,
    showHomeCountry,
    showFutureVisits,
    showVisitedCountries,
  } = useMapOverlays();
  const {
    HOME_COUNTRY_COLOR,
    VISITED_COUNTRY_COLOR,
    FUTURE_VISIT_COUNTRY_COLOR,
    SELECTED_COUNTRY_COLOR,
    visitColors,
  } = useMapTheme({ mode: colorMode });
  const { t } = useTranslation("atlas");

  // Determine if legend items can be shown based on map view state
  const canShow = !isReadonly && !isEdit;

  // Tracking mode legend
  const trackingLegendItems: LegendItem[] = [
    ...(showHomeCountry && canShow
      ? [{ color: HOME_COUNTRY_COLOR, label: t("legend.homeCountry") }]
      : []),
    ...(showVisitedCountries && canShow
      ? [
          {
            color: VISITED_COUNTRY_COLOR,
            label: t("legend.tracking.visitedCountries"),
          },
        ]
      : []),
    ...(showFutureVisits && canShow
      ? [
          {
            color: FUTURE_VISIT_COUNTRY_COLOR,
            label: t("legend.tracking.futureVisits"),
          },
        ]
      : []),
    ...(showWantToVisitCountries && canShow
      ? [
          {
            color: SELECTED_COUNTRY_COLOR,
            label: t("legend.tracking.wantToVisit"),
          },
        ]
      : []),
    ...layers
      .filter((o) => o.visible && !o.name.toLowerCase().includes("visited"))
      .map((o) => ({ color: o.color, label: o.name })),
  ];

  // Cumulative mode legend
  const cumulativeLegendItems: LegendItem[] = [
    { color: visitColors.home, label: t("legend.homeCountry") },
    {
      color: visitColors.visitCounts[4],
      label: t("legend.cumulative.fivePlusVisits"),
    },
    {
      color: visitColors.visitCounts[3],
      label: t("legend.cumulative.fourVisits"),
    },
    {
      color: visitColors.visitCounts[2],
      label: t("legend.cumulative.threeVisits"),
    },
    {
      color: visitColors.visitCounts[1],
      label: t("legend.cumulative.twoVisits"),
    },
    {
      color: visitColors.visitCounts[0],
      label: t("legend.cumulative.oneVisit"),
    },
    { color: visitColors.base, label: t("legend.notVisited") },
  ];

  // Yearly mode legend
  const yearlyLegendItems: LegendItem[] = [
    { color: visitColors.home, label: t("legend.homeCountry") },
    {
      color: visitColors.yearly.upcoming,
      label: t("legend.yearly.upcomingFirstVisit"),
    },
    {
      color: visitColors.yearly.upcomingRevisit,
      label: t("legend.yearly.upcomingRevisit"),
    },
    {
      color: visitColors.yearly.new,
      label: t("legend.yearly.firstVisitThisYear"),
    },
    {
      color: visitColors.yearly.revisit,
      label: t("legend.yearly.revisitThisYear"),
    },
    {
      color: visitColors.yearly.previous,
      label: t("legend.yearly.visitedPreviousYears"),
    },
    { color: visitColors.base, label: t("legend.notVisited") },
  ];

  // Return appropriate legend items based on mode
  if (!timelineMode) return trackingLegendItems;

  return colorMode === "cumulative" ? cumulativeLegendItems : yearlyLegendItems;
}
