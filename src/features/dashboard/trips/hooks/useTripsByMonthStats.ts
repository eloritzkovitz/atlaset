import { useTrips } from "@contexts/TripsContext";
import { isAbroadTrip } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user";

// Month names array
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type MonthName = (typeof MONTHS)[number];

/**
 * Provides statistics of trips by month.
 * @returns Trips by month data.
 */
export function useTripsByMonthStats() {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  // Prepare month stats
  const monthStats: Record<string, { local: number; abroad: number }> = {};
  trips.forEach((trip) => {
    if (trip.startDate) {
      const date = new Date(trip.startDate);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth();
        const monthName = MONTHS[month];
        if (!monthStats[monthName]) {
          monthStats[monthName] = { local: 0, abroad: 0 };
        }
        if (isAbroadTrip(trip, homeCountry)) {
          monthStats[monthName].abroad += 1;
        } else {
          monthStats[monthName].local += 1;
        }
      }
    }
  });

  // Prepare data for all months
  const allMonths = MONTHS;
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
    null as (typeof tripsByMonthData)[0] | null
  );

  // Total trips for percentage
  const totalTripsForMonth = tripsByMonthData.reduce(
    (sum, m) => sum + m.total,
    0
  );

  return {
    tripsByMonthData,
    mostPopularMonth,
    totalTripsForMonth,
  };
}
