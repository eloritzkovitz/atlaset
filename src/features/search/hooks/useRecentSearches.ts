import { useLocalStorageState } from "@hooks";

/** Manages recent searches using localStorage.
 * @param maxCount - The maximum number of recent searches to keep.
 * @returns An object with recent searches and functions to manage them.
 */
export function useRecentSearches(maxCount = 5) {
  const [recentSearches, setRecentSearches] = useLocalStorageState<string[]>(
    "atlaset:recent_searches",
    [],
  );

  /** Saves a recent search term. */
  const saveRecentSearch = (term: string) => {
    setRecentSearches(
      [term, ...recentSearches.filter((s) => s !== term)].slice(0, maxCount),
    );
  };

  /** Removes a recent search term. */
  const removeRecentSearch = (term: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== term));
  };

  /** Clears all recent searches. */
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  };
}
