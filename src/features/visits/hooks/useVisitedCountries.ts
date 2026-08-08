import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { logUserActivity } from "@features/activity";
import { getCountryName, useCountryData } from "@features/countries";
import { useTrips } from "@features/trips/context/TripsContext";
import { useAuth } from "@features/user/auth";
import {
  countryTrackingService,
  type TrackingField,
} from "../services/countryTrackingService";
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

  const [manualVisitedCodes, setManualVisitedCodes] = useState<string[]>([]);
  const [wantToVisitCountryCodes, setWantToVisitCountryCodes] = useState<
    string[]
  >([]);

  // Compute trip-based visited countries directly from trips (only when user exists)
  const tripVisitedCodes = useMemo(() => {
    if (!user) return [];
    return computeVisitedCountriesFromTrips(trips);
  }, [user, trips]);

  // Combine manual and trip-based visited codes into a unified list
  const visitedCountryCodes = useMemo(() => {
    if (!user) return [];
    return Array.from(new Set([...manualVisitedCodes, ...tripVisitedCodes]));
  }, [user, manualVisitedCodes, tripVisitedCodes]);

  // Recompute future visit countries using the unified visited list
  const futureCountryCodes = useMemo(() => {
    if (!user) return [];
    return getFutureVisitCountries(trips).filter(
      (code) => !visitedCountryCodes.includes(code),
    );
  }, [user, trips, visitedCountryCodes]);

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
    fieldName: TrackingField;
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

  // Subscribe to Firestore tracking changes
  useEffect(() => {
    if (!user) {
      setManualVisitedCodes([]);
      setWantToVisitCountryCodes([]);
      return;
    }

    const unsubscribe = countryTrackingService.onTrackingDataChange(
      user.uid,
      (trackingData) => {
        setManualVisitedCodes(trackingData.manualVisitedCountryCodes || []);
        setWantToVisitCountryCodes(trackingData.wantToVisitCountryCodes || []);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Validation functions to check if a country is in a specific list
  const isVisitedCountry = (isoCode: string) =>
    visitedCountryCodes.includes(isoCode);
  const isManualVisitedCountry = (isoCode: string) =>
    manualVisitedCodes.includes(isoCode);
  const isFutureVisitCountry = (isoCode: string) =>
    futureCountryCodes.includes(isoCode);
  const isWantToVisitCountry = (isoCode: string) =>
    wantToVisitCountryCodes.includes(isoCode);
  const isTripBased = (isoCode: string) => tripVisitedCodes.includes(isoCode);

  // Manually add a country code to the visited list
  async function addManualCountry(isoCode: string) {
    if (isManualVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "manualVisitedCountryCodes",
      actionCode: 244,
      listName: "Visited Countries",
      operation: "add",
    });
  }

  // Manually remove a country code from the visited list
  async function removeManualCountry(isoCode: string) {
    if (!isManualVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "manualVisitedCountryCodes",
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
        yearRange: yearRange ?? t("formatting.date.tbd"),
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
      yearRange: v.yearRange ?? t("formatting.date.tbd"),
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
