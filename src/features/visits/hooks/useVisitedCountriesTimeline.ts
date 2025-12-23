import { useTrips } from "@contexts/TripsContext";
import { useHomeCountry } from "@features/user";
import {
  getVisitedCountriesForYear,
  getVisitedCountriesUpToYear,
  getNextUpcomingTripYearByCountry,
} from "../utils/visits";

export function useVisitedCountriesTimeline() {
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  return {
    getVisitedCountriesForYear: (year: number) =>
      getVisitedCountriesForYear(trips, year, homeCountry),
    getVisitedCountriesUpToYear: (year: number) =>
      getVisitedCountriesUpToYear(trips, year, homeCountry),
    getUpcomingCountries: () => getNextUpcomingTripYearByCountry(trips),
  };
}
