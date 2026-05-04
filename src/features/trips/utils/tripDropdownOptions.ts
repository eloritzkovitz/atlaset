/**
 * Utility functions for generating dropdown options for trips filtering.
 */

import i18next from "i18next";
import type { TFunction } from "i18next";
import type { Country } from "@features/countries";
import type { UserProfile } from "@features/user";
import { extractUniqueValues } from "@utils/array";
import { toDropdownOptions } from "@utils/dropdown";
import { capitalizeWords } from "@utils/string";
import {
  ALL_TRIP_CATEGORIES,
  ALL_TRIP_STATUSES,
  ALL_TRIP_TAGS,
} from "../constants/trips";
import type { Trip, TripCategory, TripTag } from "../types";

/**
 * Gets country dropdown options for filtering.
 * @param countries - List of all countries.
 * @param usedCountryCodes - Set of country codes that have trips.
 * @returns An array of dropdown options with plain text labels.
 */
export function getCountryDropdownOptions(
  countries: Country[],
  usedCountryCodes: Set<string>,
) {
  const filtered = countries
    .filter((c) => usedCountryCodes.has(c.isoCode))
    .sort((a, b) => a.name.localeCompare(b.name));
  return toDropdownOptions(
    filtered,
    (c) => c.isoCode,
    (c) => c.name,
  );
}

/**
 * Gets year dropdown options for filtering.
 * @param usedYears - Array of years that have trips.
 * @returns An array of dropdown options.
 */
export function getYearDropdownOptions(usedYears: number[]) {
  const years = usedYears.map(String);
  return toDropdownOptions(years, (y) => y);
}

/**
 * Gets participants dropdown options for filtering.
 * @param participantUids - Array of participant UIDs.
 * @param participantProfiles - Array of user profiles for those UIDs.
 * @returns An array of dropdown options with display names as labels.
 */
export function getParticipantsDropdownOptions(
  participantUids: string[],
  participantProfiles: UserProfile[],
) {
  return participantUids.map((uid) => {
    const profile = participantProfiles.find((p) => p.uid === uid);
    return {
      value: uid,
      label: profile?.displayName || uid,
    };
  });
}

/**
 * Gets category dropdown options for filtering.
 * @param trips - Array of trips to extract categories from.
 * @returns An array of dropdown options.
 */
export function getCategoryDropdownOptions(trips: Trip[] = [], t?: TFunction) {
  const tr = t ?? i18next.t.bind(i18next);
  const categories: TripCategory[] = extractUniqueValues(
    trips,
    (ttrip) => ttrip.categories,
    ALL_TRIP_CATEGORIES,
  );
  return toDropdownOptions(
    categories,
    (c) => c,
    (c) => tr(`categories.${c}`, capitalizeWords(c.replace(/-/g, " "))),
  );
}

/**
 * Gets status dropdown options for filtering.
 * @returns An array of dropdown options.
 */
export function getStatusDropdownOptions(t?: TFunction) {
  const tr = t ?? i18next.t.bind(i18next);
  return [
    { value: "", label: tr("table.placeholders.allStatuses", "All Statuses") },
    ...ALL_TRIP_STATUSES.map((s) => ({
      value: s,
      label: tr(`statuses.${s}`, capitalizeWords(s.replace(/-/g, " "))),
    })),
  ];
}

/**
 * Gets tag dropdown options for filtering.
 * @param trips - Array of trips to extract tags from.
 * @returns An array of dropdown options.
 */
export function getTagDropdownOptions(trips: Trip[] = [], t?: TFunction) {
  const tr = t ?? i18next.t.bind(i18next);
  const tags: TripTag[] = extractUniqueValues(
    trips,
    (trip) => trip.tags,
    ALL_TRIP_TAGS,
  );
  return toDropdownOptions(
    tags,
    (tag) => tag,
    (tag) => tr(`tags.${tag}`, capitalizeWords(tag.replace(/-/g, " "))),
  );
}
