
import { useTrips } from "@contexts/TripsContext";
import { getMonthName } from "@utils/date";

export function useTripsByMonthStats() {
  const { trips } = useTrips();

  // Trips by month
  const tripsByMonth: Record<string, number> = {};
  trips.forEach((trip) => {
    if (trip.startDate) {
      const date = new Date(trip.startDate);
      if (!isNaN(date.getTime())) {
        const month = date.getMonth(); // 0 = Jan, 11 = Dec
        const monthName = String((getMonthName as any)(month)); // e.g. "Jan"
        tripsByMonth[monthName] = (tripsByMonth[monthName] || 0) + 1;
      }
    }
  });

  // Prepare pie chart data: [{ name: "Jan", value: 5 }, ...]
  const tripsByMonthData = Object.entries(tripsByMonth)
    .map(([name, value]) => ({ name, value }))
    .sort(
      (a, b) =>
        // Sort by month order (Jan, Feb, ...)
        getMonthName().indexOf(a.name) - getMonthName().indexOf(b.name)
    );

  // Find most popular month
  const mostPopularMonth = tripsByMonthData.reduce(
    (max, curr) => (curr.value > (max?.value ?? 0) ? curr : max),
    null as { name: string; value: number } | null
  );

  // Total trips for percentage
  const totalTripsForMonth = tripsByMonthData.reduce(
    (sum, m) => sum + m.value,
    0
  );

  return {    
    tripsByMonthData,
    mostPopularMonth,
    totalTripsForMonth,    
  };
}
