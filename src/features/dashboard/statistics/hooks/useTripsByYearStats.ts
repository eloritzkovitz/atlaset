import { useMemo } from "react";
import { useTrips } from "@contexts/TripsContext";
import { isAbroadTrip } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user/profile/hooks/useHomeCountry";

export type YearStats = {
  year: number;
  local: number;
  abroad: number;
  total: number;
};

/**
 * Provides statistics of trips by year.
 */
export function useTripsByYearStats() {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  const tripsByYearData = useMemo(() => {
    const yearStats: Record<number, { local: number; abroad: number }> = {};

    trips.forEach((trip) => {
      if (trip.startDate) {
        const date = new Date(trip.startDate);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          yearStats[year] ??= { local: 0, abroad: 0 };
          if (isAbroadTrip(trip, homeCountry)) {
            yearStats[year].abroad += 1;
          } else {
            yearStats[year].local += 1;
          }
        }
      }
    });

    return Object.entries(yearStats)
      .map(([year, stats]) => ({
        year: Number(year),
        local: stats.local,
        abroad: stats.abroad,
        total: stats.local + stats.abroad,
      }))
      .sort((a, b) => a.year - b.year);
  }, [trips, homeCountry]);

  return { tripsByYearData };
}
