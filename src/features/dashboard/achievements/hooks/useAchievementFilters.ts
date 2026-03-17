import { useMemo } from "react";
import {
  getAchievementStatus,
  isCompleted,
  getMergedAchievements,
} from "../utils/achievements";
import type { Country } from "@features/countries";
import type { Trip } from "@features/trips";
import type { Achievement } from "../types";

export interface AchievementFilters {
  typeFilter: string;
  statusFilter: string;
  search: string;
  sortBy: string;
  achievementsData: Achievement[] | null;
  countries: Country[];
  visited: { isCountryVisited: (iso: string) => boolean };
  trips: Trip[];
  homeCountry: string;
}

export function useAchievementFilters({
  typeFilter,
  statusFilter,
  search,
  sortBy,
  achievementsData,
  countries,
  visited,
  trips,
  homeCountry,
}: AchievementFilters) {
  // Merge achievements with user data to determine status and progress
  const mergedAchievements = useMemo(() => {
    if (!achievementsData) return [];
    return getMergedAchievements(
      achievementsData,
      countries,
      visited,
      trips,
      homeCountry,
    );
  }, [achievementsData, countries, visited, trips, homeCountry]);

  // Filter and sort achievements based on current filters and search query
  const sortedAchievements = useMemo(() => {
    if (!mergedAchievements.length) return [];
    let filtered = mergedAchievements;
    if (typeFilter !== "all") {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (a) =>
          getAchievementStatus(a, countries, visited, trips, homeCountry) ===
          statusFilter,
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)),
      );
    }
    const [key, dir] = sortBy.split("-");
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (key === "name") cmp = a.name.localeCompare(b.name);
      else if (key === "id") cmp = String(a.id).localeCompare(String(b.id));
      return dir === "asc" ? cmp : -cmp;
    });
  }, [
    mergedAchievements,
    typeFilter,
    statusFilter,
    search,
    countries,
    visited,
    trips,
    homeCountry,
    sortBy,
  ]);

  // Create a map of achievement ID to completion status for quick lookup
  const achievementStatusMap = useMemo(() => {
    if (!achievementsData) return {};
    const map: Record<string, boolean> = {};
    for (const ach of achievementsData) {
      map[ach.id] = isCompleted(ach, countries, visited, trips, homeCountry);
    }
    return map;
  }, [achievementsData, countries, visited, trips, homeCountry]);

  return {
    mergedAchievements,
    sortedAchievements,
    achievementStatusMap,
  };
}
