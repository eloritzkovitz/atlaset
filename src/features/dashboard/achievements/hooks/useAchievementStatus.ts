import { useAchievementsData } from "./useAchievementsData";
import { useVisitedCountries } from "@features/visits";
import { useTrips } from "@contexts/TripsContext";
import { useHomeCountry } from "@features/user";
import { useCountryData } from "@features/countries";
import { useAchievementFilters } from "./useAchievementFilters";

/**
 * Gets the achievement status map for all achievements based on the user's data.
 * @returns Object containing the achievement status map and the merged achievements with user data
 */
export function useAchievementStatus() {
  const { achievementsData } = useAchievementsData();
  const { countries } = useCountryData();
  const visited = useVisitedCountries();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  const filterResult = useAchievementFilters({
    typeFilter: "all",
    statusFilter: "all",
    search: "",
    sortBy: "id-asc",
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
