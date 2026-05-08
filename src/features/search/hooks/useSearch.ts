import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@contexts/AuthContext";
import { getSubregionsForRegion, useCountryData } from "@features/countries";
import { useUserFriends } from "@features/user";
import { useUserSearch } from "../hooks/useUserSearch";
import type { SearchResult, UserSearchResult } from "../types";
import { rankAndMap } from "../utils/search";

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
  const { countries, currencies, allRegions } = useCountryData();
  const { i18n } = useTranslation("countries");

  // Combine and rank results whenever search term or source data changes
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Users
    const getUserRank = (
      u: UserSearchResult & { isCurrentUser?: boolean; isFriend?: boolean },
    ) => (u.isCurrentUser ? 0 : u.isFriend ? 1 : 2);
    const rankedUsers = rankAndMap(
      userResults,
      (u) => u.displayName,
      searchTerm,
      (u) => u,
    ).sort((a, b) => getUserRank(a) - getUserRank(b));

    // Countries
    const mappedCountries = rankAndMap(
      countries || [],
      (c) => c.name,
      searchTerm,
      (c) => ({ ...c, type: "country" as const }),
    );

    // Currencies
    const mappedCurrencies = rankAndMap(
      currencies || [],
      (c) => c.name,
      searchTerm,
      (c) => ({ ...c, type: "currency" as const }),
    );

    // Regions
    const mappedRegions = rankAndMap(
      allRegions || [],
      (r) => String(i18n.t(`countries:regions.${r}`, { defaultValue: r })),
      searchTerm,
      (region) => ({ type: "region" as const, region }),
    );

    // Subregions
    const mappedSubregions: SearchResult[] = (allRegions || []).flatMap(
      (region) => {
        const subregions = getSubregionsForRegion(countries || [], region);
        return rankAndMap(
          subregions.map((subregion) => ({ region, subregion })),
          (s) =>
            String(
              i18n.t(`countries:subregions.${region}.${s.subregion}`, {
                defaultValue: s.subregion,
              }),
            ),
          searchTerm,
          (s) => ({
            type: "subregion" as const,
            region: s.region,
            subregion: s.subregion,
          }),
        );
      },
    );

    setResults([
      ...rankedUsers,
      ...mappedCountries,
      ...mappedCurrencies,
      ...mappedRegions,
      ...mappedSubregions,
    ]);
    setLoading(false);
  }, [searchTerm, userResults, countries, currencies, allRegions]);

  return { results, loading };
}
