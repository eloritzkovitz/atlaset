import { useCountryData } from "@contexts/CountryDataContext";
import { useHomeCountry } from "@features/settings";
import { useTrips } from "@contexts/TripsContext";
import {
  getCompletedTrips,
  getLocalTrips,
  getAbroadTrips,
} from "@features/trips/utils/trips";
import {
  getCountriesVisited,
  getMostVisitedCountries,
  getLongestTrip,
  getShortestTrip,
} from "@features/trips/utils/tripStats";

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

  // Countries visited (completed only)
  const countriesVisited = getCountriesVisited(completedTrips).length;

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
  const longestTrip = getLongestTrip(abroadTrips);
  const shortestTrip = getShortestTrip(abroadTrips);

  return {
    totalTrips,
    localTrips,
    abroadTrips,
    completedTrips,
    completedAbroadTrips,
    countriesVisited,
    mostVisitedCountries,
    maxCount,
    longestTrip,
    shortestTrip,
  };
}
