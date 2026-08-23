import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCountryData } from "@features/countries/core/hooks/useCountryData";
import { useFriendProfiles } from "@features/user/friends/hooks/useFriendProfiles";
import { useHomeCountry } from "@features/user/profile/hooks/useHomeCountry";
import { isStringOption } from "@utils/ui/dropdown";
import type { Trip, TripFilterState } from "../types";
import {
  isAbroadTrip,
  isCancelledTrip,
  isCompletedTrip,
  isInProgressTrip,
  isLocalTrip,
  isPlannedTrip,
  isUpcomingTrip,
} from "../utils/trips";
import { getUsedCountryCodes, getUsedYears } from "../utils/tripData";
import {
  getCountryDropdownOptions,
  getYearDropdownOptions,
  getCategoryDropdownOptions,
  getStatusDropdownOptions,
  getTagDropdownOptions,
  getParticipantsDropdownOptions,
} from "../utils/tripDropdownOptions";
import { filterTrips } from "../utils/tripFilters";

const defaultTripFilterState: TripFilterState = {
  name: "",
  rating: null,
  country: [],
  year: [],
  participants: [],
  categories: [],
  status: null,
  tags: [],
  local: true,
  abroad: true,
  planned: true,
  upcoming: true,
  completed: true,
  cancelled: true,
  favorite: false,
};

/**
 * Manages trip filtering logic and state.
 * @param trips List of trips to filter
 * @param initialFilters Initial filter state
 * @param globalSearch Global search string
 * @returns Filtered trips and filter state handlers
 */
export function useTripFilters(
  trips?: Trip[],
  initialFilters?: Partial<TripFilterState>,
  globalSearch?: string,
) {
  const { countries, countryByIsoCode } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { t } = useTranslation("trips");

  const tripList = useMemo(() => trips ?? [], [trips]);

  // Unified filter state
  const [filters, setFilters] = useState<TripFilterState>({
    ...defaultTripFilterState,
    ...initialFilters,
  });

  // Update a single filter
  function updateFilter<K extends keyof TripFilterState>(
    key: K,
    value: TripFilterState[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  // Reset all filters to default
  function resetFilters() {
    setFilters(defaultTripFilterState);
  }

  // Filtered trips with toggles and global search
  const filteredTrips = useMemo(() => {
    let result = trips ?? [];

    // Apply toggle filters
    result = result.filter((trip) => {
      // Location Group (Must match at least one active location toggle)
      const locationMatch =
        (filters.local && isLocalTrip(trip, homeCountry)) ||
        (filters.abroad && isAbroadTrip(trip, homeCountry));

      // Status Group (Must match at least one active status toggle)
      const statusMatch =
        (filters.completed && isCompletedTrip(trip)) ||
        (filters.upcoming &&
          (isUpcomingTrip(trip) || isInProgressTrip(trip))) ||
        (filters.planned && isPlannedTrip(trip)) ||
        (filters.cancelled && isCancelledTrip(trip));

      // Favorite Group (Modifier: only filters out when turned ON)
      const favoriteMatch = !filters.favorite || trip.favorite === true;

      // Must pass all groups
      return locationMatch && statusMatch && favoriteMatch;
    });

    // Apply column filters
    result = filterTrips(result, filters);

    // Apply global search if provided
    if (globalSearch && globalSearch.trim() !== "") {
      const search = globalSearch.toLowerCase();
      result = result.filter((trip) => {
        const countryNames = (trip.countryCodes ?? [])
          .map((code) => countryByIsoCode[code]?.name)
          .filter(Boolean)
          .map((name) => name.toLowerCase());

        return (
          trip.name?.toLowerCase().includes(search) ||
          trip.countryCodes?.some((c) => c.includes(search)) ||
          countryNames.some((name) => name.includes(search)) ||
          (trip.tags ?? []).some((tag) => tag.toLowerCase().includes(search)) ||
          (trip.categories ?? []).some((cat) =>
            cat.toLowerCase().includes(search),
          )
        );
      });
    }
    return result;
  }, [trips, filters, globalSearch, countryByIsoCode, homeCountry]);

  // Country options
  const usedCountryCodes = useMemo(
    () => getUsedCountryCodes(tripList),
    [tripList],
  );
  const rawCountryOptions = getCountryDropdownOptions(
    countries,
    usedCountryCodes,
  );
  const countryOptions = useMemo(
    () =>
      rawCountryOptions.map((opt) => {
        if (!isStringOption(opt)) return opt;

        return {
          ...opt,
          country: countryByIsoCode[opt.value],
        };
      }),
    [rawCountryOptions, countryByIsoCode],
  );

  // Year options
  const usedYears = useMemo(() => getUsedYears(tripList), [tripList]);
  const yearOptions = getYearDropdownOptions(usedYears);

  // Participants options
  const participantUids = useMemo(() => {
    const set = new Set<string>();
    for (const trip of tripList) {
      if (Array.isArray(trip.participants)) {
        for (const uidRaw of trip.participants) {
          set.add(String(uidRaw));
        }
      }
    }
    return Array.from(set);
  }, [tripList]);

  const { profiles: participantProfiles } = useFriendProfiles(participantUids);
  const participantsOptions = useMemo(
    () => getParticipantsDropdownOptions(participantUids, participantProfiles),
    [participantUids, participantProfiles],
  );

  // Category options
  const allCategoryOptions = useMemo(
    () => getCategoryDropdownOptions([], t),
    [t],
  );
  const usedCategories = useMemo(
    () => new Set(tripList.flatMap((trip) => trip.categories ?? [])),
    [tripList],
  );

  const categoryOptions = useMemo(
    () =>
      tripList.length === 0
        ? allCategoryOptions
        : allCategoryOptions.filter((opt) => usedCategories.has(opt.value)),
    [tripList, allCategoryOptions, usedCategories],
  );

  // Status and Tag options
  const statusOptions = getStatusDropdownOptions(t);
  const tagOptions = getTagDropdownOptions(tripList, t);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredTrips,
    countryOptions,
    yearOptions,
    participantsOptions,
    categoryOptions,
    statusOptions,
    tagOptions,
  };
}
