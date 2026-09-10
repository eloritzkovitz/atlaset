import type { Location } from "./types";
import { backendFetch } from "../api-client/backend";

interface LocationsResponse {
  locations: Location[];
}

/**
 * Fetches trip locations by their GeoNames IDs from the backend API.
 * @param locationIds - The GeoNames IDs of the trip locations to fetch.
 * @param signal - An optional AbortSignal to cancel the request.
 * @throws Error if authentication is required or if the fetch fails.
 * @returns A promise that resolves to an array of Location objects.
 */
export async function fetchLocationsByIds(
  locationIds: number[],
  signal?: AbortSignal,
): Promise<Location[]> {
  const params = new URLSearchParams({
    ids: locationIds.join(","),
  });

  const response = await backendFetch(`/locations?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Location fetch failed: ${response.status}`);
  }

  const data = (await response.json()) as LocationsResponse;

  return data.locations;
}

/**
 * Searches for trip locations through the backend API.
 * @param query - The search query string.
 * @param countryCode - The country code to filter the search results.
 * @param language - The language to use for the search results.
 * @param signal - An optional AbortSignal to cancel the request.
 * @throws Error if authentication is required or if the search fails.
 * @returns A promise that resolves to an array of Location objects matching the search criteria.
 */
export async function fetchSearchLocations(
  query: string,
  countryCode: string,
  language: string,
  signal?: AbortSignal,
): Promise<Location[]> {
  const params = new URLSearchParams({
    q: query,
    countryCode,
    lang: language,
  });

  const response = await backendFetch(
    `/locations/search?${params.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Location search failed: ${response.status}`);
  }

  const data = (await response.json()) as LocationsResponse;

  return data.locations;
}
