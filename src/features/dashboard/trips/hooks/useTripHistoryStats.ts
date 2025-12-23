import { useCountryData } from "@contexts/CountryDataContext";
import { useTrips } from "@contexts/TripsContext";
import type { Country } from "@features/countries";
import { getCompletedTrips, getAbroadTrips } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user";
import { getMostVisitedCountries } from "../utils/tripStats";

/**
 * Computes trip history statistics.
 * @returns Most visited countries, first/last trip, and recent trips.
 */
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
        (c: Country) => c.isoCode?.toLowerCase() === code.toLowerCase()
      )
    )
    .filter(Boolean) as Country[];

  // First and last trip (by startDate)
  const sortedTrips = trips
    .filter((trip) => typeof trip.startDate === "string" && trip.startDate)
    .sort(
      (a, b) =>
        new Date(a.startDate as string).getTime() -
        new Date(b.startDate as string).getTime()
    );

  const firstTrip = sortedTrips[0] || null;
  const lastTrip = sortedTrips[sortedTrips.length - 1] || null;

  // Recent trips (last 3, by startDate descending)
  const recentTrips = [...sortedTrips]
    .sort(
      (a, b) =>
        new Date(b.startDate as string).getTime() -
        new Date(a.startDate as string).getTime()
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
