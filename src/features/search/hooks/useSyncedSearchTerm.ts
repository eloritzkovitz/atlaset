import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Syncs a search term state with the query param in the URL.
 * @returns A tuple of [searchTerm, setSearchTerm] where searchTerm is the current value and setSearchTerm updates it.
 */
export function useSyncedSearchTerm() {
  const location = useLocation();
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    if (queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  return [searchTerm, setSearchTerm] as const;
}
