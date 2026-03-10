import { useState, useEffect } from "react";
import { useCountryData } from "@features/countries";
import { useUserSearch } from "../hooks/useUserSearch";
import type {
  SearchResult,
  UserSearchResult,
  CountrySearchResult,
} from "../types";

export function useSearch(searchTerm: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Get search results for individual types
  const { results: userResults } = useUserSearch(searchTerm);
  const { countries } = useCountryData();

  // Combine search results
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Only set loading true if a new search is starting
    setLoading(true);

    // Filter countries by search term
    const filteredCountries = countries
      ? countries.filter(
          (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.isoCode &&
              c.isoCode.toLowerCase().includes(searchTerm.toLowerCase())),
        )
      : [];

    // Map user results
    const mappedUsers: UserSearchResult[] = userResults.map((u) => ({
      ...u,
      type: "user",
    }));

    // Map country results
    const mappedCountries: CountrySearchResult[] = filteredCountries.map(
      (c) => ({
        ...c,
        type: "country",
      }),
    );

    // Combine and sort
    setResults([...mappedUsers, ...mappedCountries]);
    setLoading(false);
  }, [searchTerm, userResults, countries]);

  return { results, loading };
}
