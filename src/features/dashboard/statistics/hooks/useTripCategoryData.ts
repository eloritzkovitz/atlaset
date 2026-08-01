import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons/lib";
import {
  TRIP_STATUS_COLOR_CLASSES,
  TRIP_STATUS_COLORS,
  TRIP_STATUS_ICONS,
  TRIP_STATUS_LABELS,
  TRIP_TYPE_COLOR_CLASSES,
  TRIP_TYPE_COLORS,
  TRIP_TYPE_ICONS,
  TRIP_TYPE_LABELS,
} from "@features/trips";
import { useTripsStats } from "./useTripsStats";

export interface TripCategoryItem {
  key: string;
  name: string;
  value: number;
  color: string;
  colorClass: string;
  icon: IconType;
}

/**
 * Provides data for trip category charts.
 */
export function useTripCategoryData() {
  const { t } = useTranslation("dashboard");

  const {
    localTrips,
    abroadTrips,
    completedTrips,
    inProgressTrips,
    upcomingTrips,
    plannedTrips,
    cancelledTrips,
  } = useTripsStats();

  const statusData = useMemo<TripCategoryItem[]>(
    () => [
      {
        key: "planned",
        name: t("trips:statuses.planned", {
          defaultValue: TRIP_STATUS_LABELS[0],
        }),
        value: plannedTrips.length,
        color: TRIP_STATUS_COLORS[0],
        colorClass: TRIP_STATUS_COLOR_CLASSES["planned"],
        icon: TRIP_STATUS_ICONS[0],
      },
      {
        key: "upcoming",
        name: t("trips:statuses.upcoming", {
          defaultValue: TRIP_STATUS_LABELS[1],
        }),
        value: upcomingTrips.length,
        color: TRIP_STATUS_COLORS[1],
        colorClass: TRIP_STATUS_COLOR_CLASSES["upcoming"],
        icon: TRIP_STATUS_ICONS[1],
      },
      {
        key: "in-progress",
        name: t("trips:statuses.in-progress", {
          defaultValue: TRIP_STATUS_LABELS[2],
        }),
        value: inProgressTrips.length,
        color: TRIP_STATUS_COLORS[2],
        colorClass: TRIP_STATUS_COLOR_CLASSES["in-progress"],
        icon: TRIP_STATUS_ICONS[2],
      },
      {
        key: "completed",
        name: t("trips:statuses.completed", {
          defaultValue: TRIP_STATUS_LABELS[3],
        }),
        value: completedTrips.length,
        color: TRIP_STATUS_COLORS[3],
        colorClass: TRIP_STATUS_COLOR_CLASSES["completed"],
        icon: TRIP_STATUS_ICONS[3],
      },
      {
        key: "cancelled",
        name: t("trips:statuses.cancelled", {
          defaultValue: TRIP_STATUS_LABELS[4],
        }),
        value: cancelledTrips.length,
        color: TRIP_STATUS_COLORS[4],
        colorClass: "bg-status-cancelled/90 hover:bg-status-cancelled",
        icon: TRIP_STATUS_ICONS[4],
      },
    ],
    [
      plannedTrips.length,
      upcomingTrips.length,
      inProgressTrips.length,
      completedTrips.length,
      cancelledTrips.length,
      t,
    ],
  );

  const typeData = useMemo<TripCategoryItem[]>(
    () => [
      {
        key: "local",
        name: t("trips:types.local", { defaultValue: TRIP_TYPE_LABELS[0] }),
        value: localTrips.length,
        color: TRIP_TYPE_COLORS[0],
        colorClass: TRIP_TYPE_COLOR_CLASSES[0],
        icon: TRIP_TYPE_ICONS[0],
      },
      {
        key: "abroad",
        name: t("trips:types.abroad", { defaultValue: TRIP_TYPE_LABELS[1] }),
        value: abroadTrips.length,
        color: TRIP_TYPE_COLORS[1],
        colorClass: TRIP_TYPE_COLOR_CLASSES[1],
        icon: TRIP_TYPE_ICONS[1],
      },
    ],
    [localTrips.length, abroadTrips.length, t],
  );

  return { statusData, typeData };
}
