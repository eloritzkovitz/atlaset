import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTrips } from "@contexts/TripsContext";
import { logUserActivity } from "@features/activity";
import { getCountryName, useCountryData } from "@features/countries";
import { useAuth } from "@contexts/AuthContext";
import { countryTrackingService } from "../services/countryTrackingService";
import {
  computeVisitedCountriesFromTrips,
  getFutureVisitCountries,
  getVisitsForCountry,
} from "../utils/visits";

/**
 * Manages visited countries for the current user.
 * @returns Visited country codes and related utility functions.
 */
export function useVisitedCountries() {
  const { user } = useAuth();
  const { countries } = useCountryData();
  const { trips } = useTrips();
  const { t } = useTranslation("common");

  const [visitedCountryCodes, setVisitedCountryCodes] = useState<string[]>([]);
  const [futureCountryCodes, setFutureCountryCodes] = useState<string[]>([]);
  const [wantToVisitCountryCodes, setWantToVisitCountryCodes] = useState<
    string[]
  >([]);

  // Resolve country name for logging purposes
  const resolveCountryName = (isoCode: string) => {
    return getCountryName(isoCode, countries) || isoCode;
  };

  // Updates tracking lists and logs user activity
  const updateCountryTracking = async ({
    isoCode,
    fieldName,
    actionCode,
    listName,
    operation,
  }: {
    isoCode: string;
    fieldName: "visitedCountryCodes" | "wantToVisitCountryCodes";
    actionCode: 244 | 245;
    listName: "Visited Countries" | "Want to Visit";
    operation: "add" | "remove";
  }) => {
    if (!user) return;

    if (operation === "add") {
      await countryTrackingService.addCountryCode(user.uid, isoCode, fieldName);
    } else {
      await countryTrackingService.removeCountryCode(
        user.uid,
        isoCode,
        fieldName,
      );
    }

    await logUserActivity(
      actionCode,
      {
        itemName: listName,
        country: isoCode,
        countryName: resolveCountryName(isoCode),
        userName: user.displayName,
      },
      user.uid,
    ).catch(console.error);
  };

  // Compute as fallback
  const computedVisited = useMemo(
    () => computeVisitedCountriesFromTrips(trips),
    [trips],
  );

  // Subscribe to Firestore visitedCountryCodes changes
  useEffect(() => {
    if (!user) {
      setVisitedCountryCodes([]);
      setFutureCountryCodes([]);
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

  // Recompute future when trips or visited codes change
  useEffect(() => {
    if (!user) {
      setFutureCountryCodes([]);
      return;
    }

    const visited =
      visitedCountryCodes.length > 0 ? visitedCountryCodes : computedVisited;
    const future = getFutureVisitCountries(trips).filter(
      (code) => !visited.includes(code),
    );
    setFutureCountryCodes(future);
  }, [user, trips, visitedCountryCodes, computedVisited]);

  // Validation functions to check if a country is in a specific list
  const isVisitedCountry = (isoCode: string) =>
    visitedCountryCodes.includes(isoCode);
  const isFutureVisitCountry = (isoCode: string) =>
    futureCountryCodes.includes(isoCode);
  const isWantToVisitCountry = (isoCode: string) =>
    wantToVisitCountryCodes.includes(isoCode);
  const isTripBased = (isoCode: string) => computedVisited.includes(isoCode);

  // Manually add a country code to the visited list
  async function addManualCountry(isoCode: string) {
    if (isVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "visitedCountryCodes",
      actionCode: 244,
      listName: "Visited Countries",
      operation: "add",
    });
  }

  // Manually remove a country code from the visited list
  async function removeManualCountry(isoCode: string) {
    if (isTripBased(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "visitedCountryCodes",
      actionCode: 245,
      listName: "Visited Countries",
      operation: "remove",
    });
  }

  // Add a country code to the want-to-visit list
  async function addWantToVisitCountry(isoCode: string) {
    if (isWantToVisitCountry(isoCode) || isVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "wantToVisitCountryCodes",
      actionCode: 244,
      listName: "Want to Visit",
      operation: "add",
    });
  }

  // Remove a country code from the want-to-visit list
  async function removeWantToVisitCountry(isoCode: string) {
    await updateCountryTracking({
      isoCode,
      fieldName: "wantToVisitCountryCodes",
      actionCode: 245,
      listName: "Want to Visit",
      operation: "remove",
    });
  }

  // Get visits for a country
  function getCountryVisits(isoCode: string) {
    return getVisitsForCountry(trips, isoCode).map(
      ({ yearRange, tripName, tripId }) => ({
        yearRange: yearRange ?? t("date.tbd"),
        tripName,
        tripId,
      }),
    );
  }

  // Get categorized visits for a country
  function getCountryVisitsCategorized(isoCode: string) {
    const now = new Date();
    const visits = getVisitsForCountry(trips, isoCode);

    const localizeVisit = (
      v: ReturnType<typeof getVisitsForCountry>[number],
    ) => ({
      ...v,
      yearRange: v.yearRange ?? t("date.tbd"),
    });

    return {
      past: visits
        .filter((v) => v.endDate && new Date(v.endDate) < now)
        .map(localizeVisit),
      upcoming: visits
        .filter((v) => v.startDate && new Date(v.startDate) >= now)
        .map(localizeVisit),
      tentative: visits.filter((v) => !v.startDate).map(localizeVisit),
    };
  }

  return {
    visitedCountryCodes,
    futureCountryCodes,
    wantToVisitCountryCodes,
    isVisitedCountry,
    isFutureVisitCountry,
    isWantToVisitCountry,
    isTripBased,
    addManualCountry,
    removeManualCountry,
    addWantToVisitCountry,
    removeWantToVisitCountry,
    getCountryVisits,
    getCountryVisitsCategorized,
  };
}
