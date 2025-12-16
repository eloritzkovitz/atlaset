import { useTrips } from "@contexts/TripsContext";
import {
  computeVisitedCountriesFromTrips,
  getVisitsForCountry,
} from "../utils/visits";

export function useVisitedCountries() {
  const { trips } = useTrips();

  // Get visited countries from overlays
  const visitedCountryCodes = computeVisitedCountriesFromTrips(trips);

  // Check if a country is visited
  function isCountryVisited(isoCode: string) {
    return visitedCountryCodes.includes(isoCode);
  }

  // Get visits for a country
  function getCountryVisits(isoCode: string) {
    return getVisitsForCountry(trips, isoCode).map(
      ({ yearRange, tripName }) => ({
        yearRange,
        tripName,
      })
    );
  }

  // Get categorized visits for a country
  function getCountryVisitsCategorized(isoCode: string) {
    const now = new Date();
    const visits = getVisitsForCountry(trips, isoCode);
    return {
      past: visits.filter((v) => v.endDate && new Date(v.endDate) < now),
      upcoming: visits.filter(
        (v) => v.startDate && new Date(v.startDate) >= now
      ),
      tentative: visits.filter((v) => !v.startDate),
    };
  }

  return {
    visitedCountryCodes,
    isCountryVisited,
    getCountryVisits,
    getCountryVisitsCategorized,
  };
}
