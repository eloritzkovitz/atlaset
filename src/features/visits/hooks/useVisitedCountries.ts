import { useTrips } from "@contexts/TripsContext";
import { getYear } from "@utils/date";

export function useVisitedCountries() {
  const { trips } = useTrips();

  // Get visited countries from overlays
  const visitedCountryCodes = Array.from(
    new Set(trips.flatMap((trip) => trip.countryCodes ?? []))
  );

  // Check if a country is visited
  function isCountryVisited(isoCode: string) {
    return visitedCountryCodes.includes(isoCode);
  }

  // Get all visits for a country (from trips)
  function getCountryVisits(isoCode: string) {
    return trips
      .filter((trip) => trip.countryCodes?.includes(isoCode))
      .map((trip) => ({
        yearRange: trip.startDate
          ? getYear(trip.startDate) +
            (trip.endDate && getYear(trip.endDate) !== getYear(trip.startDate)
              ? ` - ${getYear(trip.endDate)}`
              : "")
          : "",
        tripName: trip.name,
      }));
  }

  return {
    visitedCountryCodes,
    isCountryVisited,
    getCountryVisits,
  };
}
