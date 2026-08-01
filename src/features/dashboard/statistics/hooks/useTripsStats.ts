import { useMemo } from "react";
import { useTrips } from "@contexts/TripsContext";
import {
  createCountryMap,
  useCountryData,
  type Country,
} from "@features/countries";
import {
  getCompletedTrips,
  getUpcomingTrips,
  getPlannedTrips,
  getLocalTrips,
  getAbroadTrips,
  getTripDays,
  isInProgressTrip,
  isCompletedTrip,
  getCancelledTrips,
} from "@features/trips/utils/trips";
import {
  buildVisitedYearMap,
  computeVisitCountsFromYearMap,
} from "@features/visits/utils/visits";
import { useHomeCountry } from "@features/user/profile";
import {
  findLongestTrip,
  findShortestTrip,
  getFirstAndLastTrip,
  getRecentTrips,
} from "../utils/tripStats";
import { getMostVisitedCountries } from "../utils/visitStats";

export interface VisitedCountryData {
  country: Country;
  visitCount: number;
}

/**
 * Computes and returns trip statistics.
 */
export function useTripsStats() {
  const { countries } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();

  return useMemo(() => {
    const countryMap = createCountryMap(countries, (c) => c);
    const getCountry = (code: string) => countryMap[code.toLowerCase()];

    // Trip statistics
    const totalTrips = trips.length;
    const localTrips = getLocalTrips(trips, homeCountry);
    const abroadTrips = getAbroadTrips(trips, homeCountry);
    const completedTrips = getCompletedTrips(trips);
    const completedAbroadTrips = getAbroadTrips(completedTrips, homeCountry);
    const inProgressTrips = trips.filter(isInProgressTrip);
    const upcomingTrips = getUpcomingTrips(trips);
    const plannedTrips = getPlannedTrips(trips);
    const cancelledTrips = getCancelledTrips(trips);

    // Country visit statistics
    const yearMap = buildVisitedYearMap(completedAbroadTrips);
    const visitCounts = computeVisitCountsFromYearMap(yearMap, 9999);

    const { codes: mostVisitedCountryCodes, maxCount } =
      getMostVisitedCountries(completedAbroadTrips, homeCountry);

    const mostVisitedCountries = mostVisitedCountryCodes
      .map(getCountry)
      .filter((c): c is Country => Boolean(c));

    const visitedCountriesRanking: VisitedCountryData[] = Object.entries(
      visitCounts,
    )
      .map(([code, count]) => {
        const country = getCountry(code);
        return country ? { country, visitCount: count } : null;
      })
      .filter((item): item is VisitedCountryData => Boolean(item))
      .sort((a, b) => b.visitCount - a.visitCount);

    // Trip duration statisticsf
    const validAbroadTrips = abroadTrips.filter((trip) =>
      isCompletedTrip(trip),
    );

    const longestTrip = findLongestTrip(validAbroadTrips);
    const shortestTrip = findShortestTrip(validAbroadTrips);

    const tripDurations = trips.map(getTripDays).filter((d) => d > 0);
    const totalDaysTraveling = tripDurations.reduce((sum, d) => sum + d, 0);
    const averageTripDuration = tripDurations.length
      ? totalDaysTraveling / tripDurations.length
      : 0;

    const { firstTrip, lastTrip } = getFirstAndLastTrip(trips);
    const recentTrips = getRecentTrips(trips, 3);

    return {
      totalTrips,
      localTrips,
      abroadTrips,
      completedTrips,
      completedAbroadTrips,
      inProgressTrips,
      upcomingTrips,
      plannedTrips,
      cancelledTrips,
      mostVisitedCountries,
      maxCount,
      visitedCountriesRanking,
      longestTrip,
      shortestTrip,
      averageTripDuration,
      totalDaysTraveling,
      firstTrip,
      lastTrip,
      recentTrips,
    };
  }, [trips, countries, homeCountry]);
}
