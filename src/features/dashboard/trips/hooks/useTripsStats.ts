import { useCountryData } from "@contexts/CountryDataContext";
import { useHomeCountry } from "@features/settings";
import { useTrips } from "@contexts/TripsContext";
import {
  getCompletedTrips,
  getLocalTrips,
  getAbroadTrips,
} from "@features/trips/utils/trips";
import {
  getMostVisitedCountries,
  getLongestTrip,
  getShortestTrip,
} from "@features/trips/utils/tripStats";
import { getMonthName } from "@utils/date";

export function useTripsStats() {
  const { countries } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();

  // Trip counts
  const totalTrips = trips.length;
  const localTrips = getLocalTrips(trips, homeCountry);
  const abroadTrips = getAbroadTrips(trips, homeCountry);

  // Only completed trips for country stats
  const completedTrips = getCompletedTrips(trips);
  const completedAbroadTrips = getAbroadTrips(completedTrips, homeCountry);

  // Most visited country (abroad only, completed)
  const { codes: mostVisitedCountryCodes, maxCount } = getMostVisitedCountries(
    completedAbroadTrips,
    homeCountry
  );

  // Get country info for display
  const mostVisitedCountries = mostVisitedCountryCodes
    .map((code) =>
      countries.find(
        (c: any) => c.isoCode?.toLowerCase() === code.toLowerCase()
      )
    )
    .filter(Boolean);

  // Longest and shortest trips (abroad only)
  const longestTripObj = abroadTrips.length
    ? abroadTrips.reduce((a, b) =>
        getLongestTrip([a]) >= getLongestTrip([b]) ? a : b
      )
    : null;
  const shortestTripObj = abroadTrips.length
    ? abroadTrips.reduce((a, b) =>
        getShortestTrip([a]) <= getShortestTrip([b]) ? a : b
      )
    : null;

  // Longest and shortest trips (abroad only)
  const longestTrip = getLongestTrip(abroadTrips);
  const shortestTrip = getShortestTrip(abroadTrips);

  // Extract trip name and date range if available
  const longestTripName = longestTripObj?.name || null;
  const longestTripRange =
    longestTripObj?.startDate && longestTripObj?.endDate
      ? `${longestTripObj.startDate} – ${longestTripObj.endDate}`
      : null;

  const shortestTripName = shortestTripObj?.name || null;
  const shortestTripRange =
    shortestTripObj?.startDate && shortestTripObj?.endDate
      ? `${shortestTripObj.startDate} – ${shortestTripObj.endDate}`
      : null;

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
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    completedAbroadTrips,
    mostVisitedCountries,
    maxCount,
    longestTrip,
    shortestTrip,
    longestTripName,
    longestTripRange,
    shortestTripName,
    shortestTripRange,
    tripsByMonthData,
    mostPopularMonth,
    totalTripsForMonth,
  };
}
