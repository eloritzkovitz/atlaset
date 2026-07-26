import { useTrips } from "@contexts/TripsContext";
import { useCountryData, type Country } from "@features/countries";
import { getCompletedTrips, getAbroadTrips } from "@features/trips/utils/trips";
import { useHomeCountry } from "@features/user/profile";
import { getFirstAndLastTrip, getRecentTrips } from "../utils/tripStats";
import { getMostVisitedCountries } from "../utils/visitStats";

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
    homeCountry,
  );

  // Get country info for display
  const mostVisitedCountries = mostVisitedCountryCodes
    .map((code) =>
      countries.find(
        (c: Country) => c.isoCode?.toLowerCase() === code.toLowerCase(),
      ),
    )
    .filter(Boolean) as Country[];

  // First and last trip (by startDate)
  const { firstTrip, lastTrip } = getFirstAndLastTrip(trips);

  // Recent trips
  const recentTrips = getRecentTrips(trips, 3);

  return {
    mostVisitedCountries,
    maxCount,
    firstTrip,
    lastTrip,
    recentTrips,
  };
}
