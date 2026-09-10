import { useEffect, useState } from "react";
import { getLocationsByIds } from "@lib/locations";
import type { Location } from "@lib/locations";

interface UseTripLocationsResult {
  locations: Location[];
  loading: boolean;
}

/**
 * Loads trip locations through the backend API.
 * @param locationIds - The GeoNames IDs of the trip locations.
 * @returns The locations found and a loading state.
 */
export function useTripLocations(
  locationIds: number[],
): UseTripLocationsResult {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch locations based on location IDs
  useEffect(() => {
    if (locationIds.length === 0) {
      setLocations([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchLocations = async () => {
      setLoading(true);

      try {
        const locations = await getLocationsByIds(
          locationIds,
          controller.signal,
        );

        setLocations(locations);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch locations:", error);
          setLocations([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchLocations();

    return () => controller.abort();
  }, [locationIds]);

  return { locations, loading };
}
