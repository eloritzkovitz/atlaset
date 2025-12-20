import { useMemo, useState } from "react";
import { createCountryMap } from "@features/countries";
import { useHomeCountry } from "@features/settings";
import type { TripFilterState } from "@features/trips/types";
import {
  getCountryDropdownOptions,
  getYearDropdownOptions,
  getCategoryDropdownOptions,
  getStatusDropdownOptions,
  getTagDropdownOptions,
} from "@features/trips/utils/tripDropdownOptions";
import {
  getUsedCountryCodes,
  getUsedYears,
} from "@features/trips/utils/tripData";
import { filterTrips } from "@features/trips/utils/tripFilters";
import {
  isAbroadTrip,
  isCompletedTrip,
  isLocalTrip,
  isUpcomingTrip,
} from "@features/trips/utils/trips";
import type { Country, Trip } from "@types";

// Default trip filters
const defaultTripFilterState: TripFilterState = {
  name: "",
  rating: null,
  country: [],
  year: [],
  categories: [],
  status: "",
  tags: [],
  local: true,
  abroad: true,
  completed: true,
  upcoming: true,
  favorite: false,
};

/**
 * Manages trip filtering logic and state.
 * @param trips List of trips to filter
 * @param countryData Country data for filtering
 * @param initialFilters Initial filter state
 * @param globalSearch Global search string
 * @returns Filtered trips and filter state handlers
 */
export function useTripFilters(
  trips?: Trip[],
  countryData?: { countries: Country[] },
  initialFilters?: Partial<TripFilterState>,
  globalSearch?: string
) {
  const { homeCountry } = useHomeCountry();

  // Ensure trips and countries are defined
  const tripList = useMemo(() => trips ?? [], [trips]);
  const countryList = useMemo(
    () => countryData?.countries ?? [],
    [countryData]
  );

  // Build country name map for fast lookups
  const countryMap = useMemo(
    () => createCountryMap(countryList, (c) => c),
    [countryList]
  );

  // Unified filter state
  const [filters, setFilters] = useState<TripFilterState>({
    ...defaultTripFilterState,
    ...initialFilters,
  });

  // Update a single filter
  function updateFilter<K extends keyof TripFilterState>(
    key: K,
    value: TripFilterState[K]
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

    // Apply toggle filters (local, abroad, completed, upcoming, favorite)
    result = result.filter((trip) => {
      // Location toggles
      const locationMatch =
        (filters.local && isLocalTrip(trip, homeCountry)) ||
        (filters.abroad && isAbroadTrip(trip, homeCountry));

      // Status toggles
      const statusMatch =
        (filters.completed && isCompletedTrip(trip)) ||
        (filters.upcoming && isUpcomingTrip(trip));

      const favoriteMatch =
        !filters.favorite || (filters.favorite && trip.favorite === true);

      // Must match one from each group
      return locationMatch && statusMatch && favoriteMatch;
    });

    // Apply column filters
    result = filterTrips(result, filters);

    // Apply global search if provided
    if (globalSearch && globalSearch.trim() !== "") {
      const search = globalSearch.toLowerCase();
      result = result.filter((trip) => {
        const countryNames = (trip.countryCodes ?? [])
          .map((code) => countryMap[code.toLowerCase()]?.name)
          .filter(Boolean)
          .map((name) => name.toLowerCase());

        return (
          trip.name?.toLowerCase().includes(search) ||
          trip.countryCodes?.some((c) => c.toLowerCase().includes(search)) ||
          countryNames.some((name) => name.includes(search)) ||
          (trip.tags ?? []).some((tag) => tag.toLowerCase().includes(search)) ||
          (trip.categories ?? []).some((cat) =>
            cat.toLowerCase().includes(search)
          )
        );
      });
    }
    return result;
  }, [trips, filters, globalSearch, countryData?.countries]);

  // Country options
  const usedCountryCodes = useMemo(
    () => getUsedCountryCodes(tripList),
    [tripList]
  );
  const rawCountryOptions = getCountryDropdownOptions(
    countryList,
    usedCountryCodes
  );
  const countryOptions = useMemo(
    () =>
      rawCountryOptions.map((opt) => {
        const country = countryMap[opt.value.toLowerCase()];
        return opt.value ? { ...opt, country } : opt;
      }),
    [rawCountryOptions, countryMap, homeCountry]
  );

  // Year options
  const usedYears = useMemo(() => getUsedYears(tripList), [tripList]);
  const yearOptions = getYearDropdownOptions(usedYears);

  // Category options
  const allCategoryOptions = useMemo(() => getCategoryDropdownOptions(), []);
  const usedCategories = useMemo(
    () => new Set(tripList.flatMap((trip) => trip.categories ?? [])),
    [tripList]
  );

  const categoryOptions = useMemo(
    () =>
      tripList.length === 0
        ? allCategoryOptions
        : allCategoryOptions.filter((opt) => usedCategories.has(opt.value)),
    [tripList, allCategoryOptions, usedCategories]
  );

  // Status and Tag options
  const statusOptions = getStatusDropdownOptions(tripList);
  const tagOptions = getTagDropdownOptions(tripList);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredTrips,
    countryOptions,
    yearOptions,
    categoryOptions,
    statusOptions,
    tagOptions,
  };
}
