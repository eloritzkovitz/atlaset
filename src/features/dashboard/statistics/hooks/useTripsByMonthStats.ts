import { useTrips } from "@contexts/TripsContext";
import { isAbroadTrip } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user";
import { formatMonthValues } from "@utils/date";

/**
 * Provides statistics of trips by month.
 * @returns Trips by month data.
 */
export function useTripsByMonthStats(monthNames: unknown) {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  // Normalize monthNames to a safe string[] (use shared helper)
  const months = formatMonthValues(monthNames);

  // Initialize monthStats for all months
  const monthStats: Record<string, { local: number; abroad: number }> = {};
  months.forEach((name) => {
    monthStats[name] = { local: 0, abroad: 0 };
  });

  // Collect trips by month
  trips.forEach((trip) => {
    if (trip.startDate) {
      const date = new Date(trip.startDate);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth();
        const monthName = months[month];
        if (!monthName) return;
        if (!monthStats[monthName])
          monthStats[monthName] = { local: 0, abroad: 0 };
        if (isAbroadTrip(trip, homeCountry)) {
          monthStats[monthName].abroad += 1;
        } else {
          monthStats[monthName].local += 1;
        }
      }
    }
  });

  // Prepare data for all months
  const allMonths = months;
  const tripsByMonthData = allMonths.map((name) => {
    const stats = monthStats[name] || { local: 0, abroad: 0 };
    return {
      name,
      local: stats.local,
      abroad: stats.abroad,
      total: stats.local + stats.abroad,
    };
  });

  // Find most popular month
  const mostPopularMonth = tripsByMonthData.reduce(
    (max, curr) => (curr.total > (max?.total ?? 0) ? curr : max),
    null as (typeof tripsByMonthData)[0] | null,
  );

  // Find least popular month
  const leastPopularMonth = tripsByMonthData.reduce(
    (min, curr) => (curr.total < (min?.total ?? Infinity) ? curr : min),
    null as (typeof tripsByMonthData)[0] | null,
  );

  // Total trips for percentage
  const totalTripsForMonth = tripsByMonthData.reduce(
    (sum, m) => sum + m.total,
    0,
  );

  return {
    tripsByMonthData,
    mostPopularMonth,
    leastPopularMonth,
    totalTripsForMonth,
  };
}
