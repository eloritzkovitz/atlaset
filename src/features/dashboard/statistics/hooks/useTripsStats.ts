import { useMemo } from "react";
import { useCountryData } from "@features/countries";
import { useTrips } from "@features/trips";
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
import { useHomeCountry } from "@features/user/profile";
import { useCountryTracking } from "@features/visits/hooks/useCountryTracking";
import type { Visit } from "@features/visits/types";
import type { VisitedCountryRankRow } from "../types";
import {
  findLongestTrip,
  findShortestTrip,
  getFirstAndLastTrip,
  getRecentTrips,
} from "../utils/tripStats";
import { getMostVisitedCountries } from "../utils/visitStats";

/**
 * Computes and returns trip statistics.
 */
export function useTripsStats() {
  const { countryByIsoCode } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { trips } = useTrips();
  const { visitedCountryCodes, getCountryVisitsCategorized } =
    useCountryTracking();

  return useMemo(() => {
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

    // Most visited countries
    const { codes: mostVisitedCountryCodes, maxCount } =
      getMostVisitedCountries(completedAbroadTrips, homeCountry);

    const mostVisitedCountries = mostVisitedCountryCodes
      .map((code) => countryByIsoCode[code])
      .filter((country): country is NonNullable<typeof country> =>
        Boolean(country),
      );

    // Visited countries ranking
    const visitedCountriesRanking: VisitedCountryRankRow[] = visitedCountryCodes
      .map((code) => {
        if (homeCountry && code === homeCountry) return null;

        const country = countryByIsoCode[code];
        if (!country) return null;

        const { past } = getCountryVisitsCategorized(code);
        if (past.length === 0) return null;

        const tripsByYear: Record<number, Visit[]> = {};

        past.forEach((visit) => {
          if (!visit.startDate) return;
          const year = new Date(visit.startDate).getFullYear();

          if (!tripsByYear[year]) tripsByYear[year] = [];

          tripsByYear[year].push({
            yearRange: visit.yearRange || String(year),
            tripName: visit.tripName || "Trip",
            tripId: visit.tripId,
          });
        });

        const years = Object.keys(tripsByYear)
          .map(Number)
          .sort((a, b) => b - a);

        return {
          country,
          visitCount: past.length,
          years,
          tripsByYear,
        };
      })
      .filter((item): item is VisitedCountryRankRow => item !== null)
      .sort((a, b) => b.visitCount - a.visitCount);

    // Trip duration statistics
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
  }, [
    trips,
    countryByIsoCode,
    homeCountry,
    visitedCountryCodes,
    getCountryVisitsCategorized,
  ]);
}
