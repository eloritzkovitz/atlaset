import { useState, useEffect, useMemo } from "react";
import { useCountryData } from "@features/countries";
import { getAllRegions } from "@features/countries/utils/countryData";
import { useUserSearch } from "../hooks/useUserSearch";
import { useAuth } from "@contexts/AuthContext";
import { useUserFriends } from "@features/user";
import type {
  SearchResult,
  UserSearchResult,
  CountrySearchResult,
} from "../types";
import { rankByStartsWithAndContains } from "../utils/search";

/**
 * Performs a search across multiple types and combines results.
 * @param searchTerm - The term to search for.
 * @returns Combined search results and loading state.
 */
export function useSearch(searchTerm: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current user and friends
  const { user: currentUser } = useAuth();
  const { friends: friendList } = useUserFriends(currentUser?.uid);
  const currentUserId = currentUser?.uid;
  const friendIds = useMemo(
    () => (friendList ? friendList.map((f) => f.uid) : []),
    [friendList],
  );

  // Get search results for individual types
  const { results: userResults } = useUserSearch(
    searchTerm,
    currentUserId,
    friendIds,
  );
  const { countries, allRegions, allSubregions } = useCountryData();

  // Combine search results
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Only set loading true if a new search is starting
    setLoading(true);

    // Rank and sort users
    const getUserRank = (
      u: UserSearchResult & { isCurrentUser?: boolean; isFriend?: boolean },
    ) => {
      if (u.isCurrentUser) return 0;
      if (u.isFriend) return 1;
      return 2;
    };
    const rankedUsers = rankByStartsWithAndContains(
      userResults,
      (u) => u.displayName,
      searchTerm,
    ).sort((a, b) => getUserRank(a) - getUserRank(b));

    // Rank and map countries
    const rankedCountries = rankByStartsWithAndContains(
      countries || [],
      (c) => c.name,
      searchTerm,
    );
    const mappedCountries: CountrySearchResult[] = rankedCountries.map((c) => ({
      ...c,
      type: "country",
    }));

    // Regions
    const allRegionStrings = Array.from(
      new Set(getAllRegions(countries || [])),
    );
    const rankedRegions = rankByStartsWithAndContains(
      allRegionStrings,
      (r) => r,
      searchTerm,
    )
      // Deduplicate after ranking
      .filter((region, idx, arr) => arr.findIndex((r) => r === region) === idx)
      .map((region) => ({ type: "region" as const, region }));

    // Subregion pairs
    const regionSubregionPairs = Array.from(
      new Set(
        (countries || [])
          .filter(
            (c) => c.region && typeof c.subregion === "string" && c.subregion,
          )
          .map((c) => `${c.region}|||${c.subregion}`),
      ),
    ).map((pair) => {
      const [region, subregion] = pair.split("|||");
      return { region, subregion };
    });
    const rankedSubregions = rankByStartsWithAndContains(
      regionSubregionPairs,
      (s) => s.subregion,
      searchTerm,
    ).map((s) => ({
      type: "subregion" as const,
      region: s.region,
      subregion: s.subregion,
    }));

    // Combine and sort
    setResults([
      ...rankedUsers,
      ...mappedCountries,
      ...rankedRegions,
      ...rankedSubregions,
    ]);
    setLoading(false);
  }, [searchTerm, userResults, countries, allRegions, allSubregions]);

  return { results, loading };
}
