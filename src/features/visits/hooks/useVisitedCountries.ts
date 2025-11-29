import { useOverlays } from "@contexts/OverlaysContext";
import { useTrips } from "@contexts/TripsContext";
import { getYear } from "@utils/date";

export function useVisitedCountries() {
  const { overlays } = useOverlays();
  const { trips } = useTrips();

  // Get visited countries from overlays
  const visitedOverlay = overlays.find((o) => o.id === "visited-countries");
  const visitedCountryCodes = visitedOverlay?.countries ?? [];

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
