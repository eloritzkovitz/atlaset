import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getQueryParam } from "@utils";

/**
 * Syncs a search term state with the query param in the URL.
 * @returns A tuple of [searchTerm, setSearchTerm] where searchTerm is the current value and setSearchTerm updates it.
 */
export function useSyncedSearchTerm() {
  const location = useLocation();
  const queryParam = getQueryParam("query", "", location.search);
  const [searchTerm, setSearchTerm] = useState(queryParam);

  // Update searchTerm whenever the query param changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  return [searchTerm, setSearchTerm] as const;
}
