import { useCountryData } from "@contexts/CountryDataContext";
import { useHomeCountry } from "@features/settings";
import { useTrips } from "@contexts/TripsContext";
import { getCompletedTrips, getAbroadTrips } from "@features/trips/utils/trips";
import { getMostVisitedCountries } from "@features/trips/utils/tripStats";

export function useTripHistoryStats() {
  const { countries } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();

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

  // First and last trip (by startDate)
  const sortedTrips = trips
    .filter((trip) => trip.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const firstTrip = sortedTrips[0] || null;
  const lastTrip = sortedTrips[sortedTrips.length - 1] || null;

  // Recent trips (last 3, by startDate descending)
  const recentTrips = [...sortedTrips]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 3);

  return {
    mostVisitedCountries,
    maxCount,
    firstTrip,
    lastTrip,
    recentTrips,
  };
}
