import { useMemo } from "react";
import { useCountryData } from "@features/countries";
import { useTrips } from "@features/trips";
import { useHomeCountry } from "@features/user/profile";
import { useCountryTracking } from "@features/visits";
import type { SortValue } from "@types";
import { useAchievementFilters } from "./useAchievementFilters";
import { useGetAchievementsQuery } from "../api/achievementsApi";
import type { AchievementSortKey } from "../types";

interface UseAchievementStatusProps {
  typeFilter?: string;
  statusFilter?: string;
  search?: string;
  sortBy?: SortValue<AchievementSortKey>;
}

/**
 * Gets the achievement status map for all achievements based on the user's data.
 * @param typeFilters - Optional filter for achievement types.
 * @param statusFilter - Optional filter for achievement status.
 * @param search - Optional search query to filter achievements by name or description.
 * @param sortBy - Optional sorting criteria.
 * @returns Object containing the achievement status map and the merged achievements with user data.
 */
export function useAchievementStatus({
  typeFilter = "all",
  statusFilter = "all",
  search = "",
  sortBy = "id-asc",
}: UseAchievementStatusProps = {}) {
  const { data: achievements, isLoading, error } = useGetAchievementsQuery();
  const { countries } = useCountryData();
  const { isVisitedCountry } = useCountryTracking();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  const filterResult = useAchievementFilters({
    typeFilter,
    statusFilter,
    search,
    sortBy,
    achievements,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  });

  return useMemo(() => {
    return {
      achievements,
      isLoading,
      error,
      ...filterResult,
      countries,
      isVisitedCountry,
      trips,
      homeCountry,
    };
  }, [
    achievements,
    isLoading,
    error,
    filterResult,
    countries,
    isVisitedCountry,
    trips,
    homeCountry,
  ]);
}
