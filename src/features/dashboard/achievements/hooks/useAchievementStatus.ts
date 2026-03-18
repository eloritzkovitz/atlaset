import { useAchievementsData } from "./useAchievementsData";
import { useVisitedCountries } from "@features/visits";
import { useTrips } from "@contexts/TripsContext";
import { useHomeCountry } from "@features/user";
import { useCountryData } from "@features/countries";
import { useAchievementFilters } from "./useAchievementFilters";

/**
 * Gets the achievement status map for all achievements based on the user's data.
 * @param typeFilters - Optional filter for achievement types
 * @param statusFilter - Optional filter for achievement status
 * @param search - Optional search query to filter achievements by name or description
 * @param sortBy - Optional sorting criteria
 * @returns Object containing the achievement status map and the merged achievements with user data
 */
export function useAchievementStatus({
  typeFilter = "all",
  statusFilter = "all",
  search = "",
  sortBy = "id-asc",
} = {}) {
  const { achievementsData } = useAchievementsData();
  const { countries } = useCountryData();
  const visited = useVisitedCountries();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  const filterResult = useAchievementFilters({
    typeFilter,
    statusFilter,
    search,
    sortBy,
    achievementsData,
    countries,
    visited,
    trips,
    homeCountry,
  });

  return {
    ...filterResult,
    countries,
    visited,
    trips,
    homeCountry,
  };
}
