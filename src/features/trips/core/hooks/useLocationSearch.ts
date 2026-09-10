import { useEffect, useState } from "react";
import { searchLocations, type Location } from "@lib/locations";

interface UseLocationSearchProps {
  isOpen: boolean;
  search: string;
  countryCodes: string[];
  language: string;
}

interface UseLocationSearchResult {
  locations: Location[];
  loading: boolean;
}

/**
 * Searches for trip locations through the backend API.
 * @param isOpen - Whether the location search is open.
 * @param search - The search query.
 * @param countryCodes - The list of country codes to search in.
 * @param language - The language to use for the search.
 * @returns The locations found and a loading state.
 */
export function useLocationSearch({
  isOpen,
  search,
  countryCodes,
  language,
}: UseLocationSearchProps): UseLocationSearchResult {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch locations based on search query and country codes
  useEffect(() => {
    if (!isOpen || !search.trim() || countryCodes.length === 0) {
      setLocations([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      setLoading(true);

      try {
        const results = await Promise.all(
          countryCodes.map((countryCode) =>
            searchLocations(
              search.trim(),
              countryCode,
              language,
              controller.signal,
            ),
          ),
        );

        const uniqueLocations = Array.from(
          new Map(
            results.flat().map((location) => [location.id, location]),
          ).values(),
        );

        setLocations(uniqueLocations);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to search locations:", error);
          setLocations([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeout = window.setTimeout(fetchLocations, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [isOpen, search, countryCodes, language]);

  return { locations, loading };
}
