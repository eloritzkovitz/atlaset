import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons/lib";
import { STATUS_COLOR_CLASSES } from "@constants/colors";
import {
  TRIP_STATUS_CONFIG,
  TRIP_TYPE_CONFIG,
  type TripStatus,
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

  const statusData = useMemo<TripCategoryItem[]>(() => {
    const tripCounts: Record<TripStatus, number> = {
      planned: plannedTrips.length,
      upcoming: upcomingTrips.length,
      "in-progress": inProgressTrips.length,
      completed: completedTrips.length,
      cancelled: cancelledTrips.length,
    };

    return (Object.keys(TRIP_STATUS_CONFIG) as TripStatus[]).map((status) => {
      const config = TRIP_STATUS_CONFIG[status];

      return {
        key: status,
        name: t(`trips:statuses.${status}`, {
          defaultValue: config.label,
        }),
        value: tripCounts[status],
        color: config.color,
        colorClass: STATUS_COLOR_CLASSES[status],
        icon: config.icon,
      };
    });
  }, [
    cancelledTrips.length,
    completedTrips.length,
    inProgressTrips.length,
    plannedTrips.length,
    upcomingTrips.length,
    t,
  ]);

  const typeData = useMemo<TripCategoryItem[]>(
    () =>
      Object.entries(TRIP_TYPE_CONFIG).map(([type, config]) => ({
        key: type,
        name: t(`trips:types.${type}`, {
          defaultValue: config.label,
        }),
        value: type === "local" ? localTrips.length : abroadTrips.length,
        color: config.color,
        colorClass: config.colorClass,
        icon: config.icon,
      })),
    [abroadTrips.length, localTrips.length, t],
  );

  return { statusData, typeData };
}
