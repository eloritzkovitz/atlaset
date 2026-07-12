import { useMemo } from "react";
import { useAchievements } from "@contexts/AchievementsContext";
import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import type { SortValue } from "@types";
import { useAchievementFilters } from "./useAchievementFilters";
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
  const { achievements } = useAchievements();
  const { countries } = useCountryData();
  const visited = useVisitedCountries();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  const filterResult = useAchievementFilters({
    typeFilter,
    statusFilter,
    search,
    sortBy,
    achievements,
    countries,
    visited,
    trips,
    homeCountry,
  });

  return useMemo(() => {
    return {
      ...filterResult,
      countries,
      visited,
      trips,
      homeCountry,
    };
  }, [filterResult, countries, visited, trips, homeCountry]);
}
