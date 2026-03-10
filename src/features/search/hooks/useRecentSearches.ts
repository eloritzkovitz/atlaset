import { useState, useEffect } from "react";

/** Manages recent searches using localStorage.
 * @param maxCount - The maximum number of recent searches to keep.
 * @returns An object with recent searches and functions to manage them.
 */
export function useRecentSearches(maxCount = 5) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    setRecentSearches(stored ? JSON.parse(stored) : []);
  }, []);

  // Save a term to recent searches only on submit/select
  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      maxCount,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Remove a term from recent searches
  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Clear all recent searches
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return {
    recentSearches,
    saveRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  };
}
