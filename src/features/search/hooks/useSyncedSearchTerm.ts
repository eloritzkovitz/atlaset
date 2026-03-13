import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Syncs a search term state with the query param in the URL.
 * @returns A tuple of [searchTerm, setSearchTerm] where searchTerm is the current value and setSearchTerm updates it.
 */
export function useSyncedSearchTerm(
  locationOverride?: ReturnType<typeof useLocation>,
) {
  const locationFromHook = useLocation();
  const location = locationOverride ? locationOverride : locationFromHook;
  const queryParam = new URLSearchParams(location.search).get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);

  // Update searchTerm whenever the query param changes
  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  return [searchTerm, setSearchTerm] as const;
}
