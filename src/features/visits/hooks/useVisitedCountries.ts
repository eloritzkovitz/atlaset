import { useEffect, useMemo, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import { useAuth } from "@features/user";
import { countryTrackingService } from "../services/countryTrackingService";
import {
  computeVisitedCountriesFromTrips,
  getUpcomingVisitCountries,
  getVisitsForCountry,
} from "../utils/visits";

/**
 * Manages visited countries for the current user.
 * @returns Visited country codes and related utility functions.
 */
export function useVisitedCountries() {
  const { user } = useAuth();
  const { trips } = useTrips();

  const [visitedCountryCodes, setVisitedCountryCodes] = useState<string[]>([]);
  const [upcomingCountryCodes, setUpcomingCountryCodes] = useState<string[]>(
    [],
  );
  const [wantToVisitCountryCodes, setWantToVisitCountryCodes] = useState<string[]>([]);

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
      setWantToVisitCountryCodes([]);
      return;
    }

    const unsubscribe = countryTrackingService.onTrackingDataChange(
      user.uid,
      (trackingData) => {
        // If Firestore has no data, fallback to computed visited from trips
        const manualCodes = trackingData.visitedCountryCodes || [];

        // Merge manual and computed visited codes, ensuring uniqueness
        const unifiedVisited = Array.from(
          new Set([...manualCodes, ...computedVisited]),
        );

        setVisitedCountryCodes(unifiedVisited);
        setWantToVisitCountryCodes(trackingData.wantToVisitCountryCodes || []);
      },
    );

    return () => {
      unsubscribe();
    };
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

  // Check if a country has any trip associated with it, regardless of whether it's marked visited in Firestore
  function isTripBased(isoCode: string) {
    return computedVisited.includes(isoCode);
  }

  // Check if a country is in the user's want-to-visit list
  function isWantToVisitListed(isoCode: string) {
    return wantToVisitCountryCodes.includes(isoCode);
  }

  // Manually add a country code to the visited list
  async function addManualCountry(isoCode: string) {
    if (!user) return;
    if (visitedCountryCodes.includes(isoCode)) return;

    await countryTrackingService.addCountryCode(
      user.uid,
      isoCode,
      "visitedCountryCodes",
    );
  }

  // Manually remove a country code from the visited list
  async function removeManualCountry(isoCode: string) {
    if (!user) return;
    if (isTripBased(isoCode)) return;

    await countryTrackingService.removeCountryCode(
      user.uid,
      isoCode,
      "visitedCountryCodes",
    );
  }

  // Add a country code to the want-to-visit list
  async function addWantToVisitCountry(isoCode: string) {
    if (!user) return;
    if (wantToVisitCountryCodes.includes(isoCode)) return;
    if (isCountryVisited(isoCode)) return;

    await countryTrackingService.addCountryCode(
      user.uid,
      isoCode,
      "wantToVisitCountryCodes",
    );
  }

  // Remove a country code from the want-to-visit list
  async function removeWantToVisitCountry(isoCode: string) {
    if (!user) return;

    await countryTrackingService.removeCountryCode(
      user.uid,
      isoCode,
      "wantToVisitCountryCodes",
    );
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
    wantToVisitCountryCodes,
    isCountryVisited,
    isTripBased,
    isWantToVisitListed,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
    getCountryVisits,
    getCountryVisitsCategorized,
  };
}
