import { useEffect, useMemo, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import { useAuth } from "@features/user";
import { visitedCountriesService } from "../services/visitedCountriesService";
import {
  computeVisitedCountriesFromTrips,
  getVisitsForCountry,
} from "../utils/visits";
import { getUpcomingVisitCountries } from "../utils/visits";

/**
 * Manages visited countries for the current user.
 * @returns - Visited country codes and related utility functions.
 */
export function useVisitedCountries() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const [visitedCountryCodes, setVisitedCountryCodes] = useState<string[]>([]);
  const [upcomingCountryCodes, setUpcomingCountryCodes] = useState<string[]>(
    [],
  );

  // Compute as fallback
  const computedVisited = useMemo(
    () => computeVisitedCountriesFromTrips(trips),
    [trips],
  );

  // Subscribe to Firestore visitedCountryCodes changes
  useEffect(() => {
    if (!user) {
      setVisitedCountryCodes([]);
      setUpcomingCountryCodes([]);
      return;
    }

    const unsubscribe = visitedCountriesService.onVisitedCountryCodesChange(
      user.uid,
      (firestoreCodes) => {
        const visited =
          firestoreCodes && firestoreCodes.length > 0
            ? firestoreCodes
            : computedVisited;
        setVisitedCountryCodes(visited);
      },
    );

    return () => unsubscribe();
  }, [user, computedVisited]);

  // Recompute upcoming when trips or visited codes change
  useEffect(() => {
    if (!user) {
      setUpcomingCountryCodes([]);
      return;
    }

    const visited =
      visitedCountryCodes.length > 0 ? visitedCountryCodes : computedVisited;
    const upcoming = getUpcomingVisitCountries(trips).filter(
      (code) => !visited.includes(code),
    );
    setUpcomingCountryCodes(upcoming);
  }, [user, trips, visitedCountryCodes, computedVisited]);

  // Check if a country is visited
  function isCountryVisited(isoCode: string) {
    return visitedCountryCodes.includes(isoCode);
  }

  // Get visits for a country
  function getCountryVisits(isoCode: string) {
    return getVisitsForCountry(trips, isoCode).map(
      ({ yearRange, tripName, tripId }) => ({
        yearRange,
        tripName,
        tripId,
      }),
    );
  }

  // Get categorized visits for a country
  function getCountryVisitsCategorized(isoCode: string) {
    const now = new Date();
    const visits = getVisitsForCountry(trips, isoCode);
    return {
      past: visits.filter((v) => v.endDate && new Date(v.endDate) < now),
      upcoming: visits.filter(
        (v) => v.startDate && new Date(v.startDate) >= now,
      ),
      tentative: visits.filter((v) => !v.startDate),
    };
  }

  return {
    visitedCountryCodes,
    upcomingCountryCodes,
    isCountryVisited,
    getCountryVisits,
    getCountryVisitsCategorized,
  };
}
