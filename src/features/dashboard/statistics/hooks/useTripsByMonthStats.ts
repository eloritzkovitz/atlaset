import { useMemo } from "react";
import { useTrips } from "@features/trips";
import { isAbroadTrip } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user/profile";
import { formatMonthValues } from "@utils";
import { MONTH_COLORS } from "../constants/statistics";

/**
 * Provides statistics of trips by month.
 */
export function useTripsByMonthStats(monthNames: unknown) {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  return useMemo(() => {
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

          if (isAbroadTrip(trip, homeCountry)) {
            monthStats[monthName].abroad += 1;
          } else {
            monthStats[monthName].local += 1;
          }
        }
      }
    });

    // Calculate total trips across all months
    const totalTripsForMonth = Object.values(monthStats).reduce(
      (sum, m) => sum + m.local + m.abroad,
      0,
    );

    // Prepare full dataset with colors & percentages
    const allMonthsData = months.map((name, idx) => {
      const stats = monthStats[name] || { local: 0, abroad: 0 };
      const total = stats.local + stats.abroad;
      return {
        name,
        local: stats.local,
        abroad: stats.abroad,
        total,
        percentage:
          totalTripsForMonth > 0 ? (total / totalTripsForMonth) * 100 : 0,
        color: MONTH_COLORS[idx % MONTH_COLORS.length],
      };
    });

    // Find most popular month (only if total > 0)
    const mostPopularMonth =
      totalTripsForMonth > 0
        ? allMonthsData.reduce(
            (max, curr) => (curr.total > max.total ? curr : max),
            allMonthsData[0],
          )
        : null;

    // Find least popular month (only if total > 0)
    const leastPopularMonth =
      totalTripsForMonth > 0
        ? allMonthsData.reduce(
            (min, curr) => (curr.total < min.total ? curr : min),
            allMonthsData[0],
          )
        : null;

    return {
      allMonthsData,
      mostPopularMonth,
      leastPopularMonth,
      totalTripsForMonth,
    };
  }, [trips, homeCountry, monthNames]);
}
