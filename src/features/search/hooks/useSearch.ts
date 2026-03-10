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
  const { results: userResults, loading: userLoading } =
    useUserSearch(searchTerm);
  const { countries, loading: countryLoading } = useCountryData();

  // Combine search results
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(userLoading || countryLoading);

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

    // Combine and sort (optional: sort by displayName)
    setResults([...mappedUsers, ...mappedCountries]);
  }, [searchTerm, userResults, countries, userLoading, countryLoading]);

  return { results, loading };
}
