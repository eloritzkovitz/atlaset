import { useTrips } from "@contexts/TripsContext";
import { useAuth } from "@contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { visitedCountriesService } from "../services/visitedCountriesService";
import {
  computeVisitedCountriesFromTrips,
  getVisitsForCountry,
} from "../utils/visits";

/**
 * Manages visited countries for the current user.
 * @returns - Visited country codes and related utility functions.
 */
export function useVisitedCountries() {
  const { user } = useAuth();
  const { trips } = useTrips();
  const [visitedCountryCodes, setVisitedCountryCodes] = useState<string[]>([]);

  // Compute as fallback
  const computedVisited = useMemo(
    () => computeVisitedCountriesFromTrips(trips),
    [trips]
  );

  // Fetch visited countries from Firestore on user or trips change
  useEffect(() => {
    if (!user) {
      setVisitedCountryCodes([]);
      return;
    }
    const fetchVisited = async () => {
      const firestoreCodes =
        await visitedCountriesService.getVisitedCountryCodes(user.uid);
      // Use Firestore codes if available, else computed
      setVisitedCountryCodes(
        firestoreCodes.length > 0 ? firestoreCodes : computedVisited
      );
    };
    fetchVisited();
  }, [user, trips, computedVisited]);

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
