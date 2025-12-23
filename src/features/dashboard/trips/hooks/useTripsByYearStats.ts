import { useTrips } from "@contexts/TripsContext";
import { isAbroadTrip } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user";

/**
 * Provides statistics of trips by year.
 * @returns Trips by year data.
 */
export function useTripsByYearStats() {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  // Collect years
  const yearStats: Record<number, { local: number; abroad: number }> = {};
  trips.forEach((trip) => {
    if (trip.startDate) {
      const year = new Date(trip.startDate).getFullYear();
      if (!yearStats[year]) {
        yearStats[year] = { local: 0, abroad: 0 };
      }
      if (isAbroadTrip(trip, homeCountry)) {
        yearStats[year].abroad += 1;
      } else {
        yearStats[year].local += 1;
      }
    }
  });

  // Prepare sorted array
  const tripsByYearData = Object.entries(yearStats)
    .map(([year, stats]) => ({
      year: Number(year),
      local: stats.local,
      abroad: stats.abroad,
      total: stats.local + stats.abroad,
    }))
    .sort((a, b) => a.year - b.year);

  return { tripsByYearData };
}
