import { useSyncedSearchTerm } from "./useSyncedSearchTerm";
import { useRecentSearches } from "./useRecentSearches";

/**
 * Manages search state.
 * Handles syncing search term with URL, managing recent searches, and search submission.
 * @returns An object containing search state and handlers.
 */
export function useSearchController() {
  const [searchTerm, setSearchTerm] = useSyncedSearchTerm();
  const {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useRecentSearches(5);

  // Handle search submission
  const handleSearchSubmit = (term: string) => {
    if (term) {
      window.location.assign(`/search?query=${encodeURIComponent(term)}`);
      saveRecentSearch(term);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearchSubmit,
    recentSearches,
    removeRecentSearch,
    clearAllRecentSearches,
  };
}
