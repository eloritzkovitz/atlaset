import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ACTIONS } from "@constants/actions";
import { logUserActivity } from "@features/activity";
import { getCountryName, useCountryData } from "@features/countries";
import { useTrips } from "@features/trips/context/TripsContext";
import { useAuth } from "@features/user/auth";
import { countryTrackingService } from "../services/countryTrackingService";
import type { CountryTrackingField, Visit } from "../types";
import {
  categorizeVisits,
  computeVisitedCountriesFromTrips,
  getFutureVisitCountries,
  getVisitsForCountry,
} from "../utils/visits";

/**
 * Manages country tracking state and operations.
 */
export function useCountryTracking() {
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
    operation,
  }: {
    isoCode: string;
    fieldName: CountryTrackingField;
    operation: "add" | "remove";
  }) => {
    if (!user) return;

    const actionCode =
      operation === "add"
        ? ACTIONS.COUNTRY_ADDED_TO_LIST
        : ACTIONS.COUNTRY_REMOVED_FROM_LIST;

    const listName =
      fieldName === "manualVisitedCountryCodes"
        ? "Visited Countries"
        : "Want to Visit";

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

  /** Manually adds a country code to the visited list. */
  async function addManualCountry(isoCode: string) {
    if (isManualVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "manualVisitedCountryCodes",
      operation: "add",
    });
  }

  /** Removes a country code from the visited list. */
  async function removeManualCountry(isoCode: string) {
    if (!isManualVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "manualVisitedCountryCodes",
      operation: "remove",
    });
  }

  /** Adds a country code to the want-to-visit list. */
  async function addWantToVisitCountry(isoCode: string) {
    if (isWantToVisitCountry(isoCode) || isVisitedCountry(isoCode)) return;
    await updateCountryTracking({
      isoCode,
      fieldName: "wantToVisitCountryCodes",
      operation: "add",
    });
  }

  /** Removes a country code from the want-to-visit list. */
  async function removeWantToVisitCountry(isoCode: string) {
    await updateCountryTracking({
      isoCode,
      fieldName: "wantToVisitCountryCodes",
      operation: "remove",
    });
  }

  /** Localizes a visit for display. */
  const localizeVisit = (visit: Visit) => ({
    ...visit,
    yearRange: visit.yearRange ?? t("formatting.date.tbd"),
  });

  /** Gets all visits for a specific country. */
  function getCountryVisits(isoCode: string) {
    return getVisitsForCountry(trips, isoCode).map(localizeVisit);
  }

  /** Gets categorized visits for a specific country. */
  function getCountryVisitsCategorized(isoCode: string) {
    const categorized = categorizeVisits(getVisitsForCountry(trips, isoCode));

    return {
      past: categorized.past.map(localizeVisit),
      upcoming: categorized.upcoming.map(localizeVisit),
      tentative: categorized.tentative.map(localizeVisit),
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
