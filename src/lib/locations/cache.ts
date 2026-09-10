import { appDb } from "@lib/db";
import type { Location } from "./types";

const locationCache = new Map<number, Location>();

/**
 * Retrieves a cached location by its ID.
 * @param id - The ID of the location to retrieve.
 * @returns A promise that resolves to the Location object if found in cache or IndexedDB, or undefined if not found.
 */
export async function getCachedLocation(
  id: number,
): Promise<Location | undefined> {
  const memoryCached = locationCache.get(id);

  if (memoryCached) {
    return memoryCached;
  }

  const persisted = await appDb.locations.get(id);

  if (persisted) {
    locationCache.set(id, persisted);
  }

  return persisted;
}

/**
 * Retrieves cached locations by their IDs.
 * @param ids - An array of location IDs to retrieve.
 * @returns A promise that resolves to an array of Location objects corresponding to the provided IDs. Locations found in the cache will be returned immediately, while missing locations will be fetched from IndexedDB and then cached for future use.
 */
export async function getCachedLocations(ids: number[]): Promise<Location[]> {
  const missingIds: number[] = [];
  const locations = new Map<number, Location>();

  for (const id of ids) {
    const cached = locationCache.get(id);

    if (cached) {
      locations.set(id, cached);
    } else {
      missingIds.push(id);
    }
  }

  if (missingIds.length > 0) {
    const persisted = await appDb.locations.bulkGet(missingIds);

    for (const location of persisted) {
      if (location) {
        locationCache.set(location.id, location);
        locations.set(location.id, location);
      }
    }
  }

  return ids
    .map((id) => locations.get(id))
    .filter((location): location is Location => location !== undefined);
}

/**
 * Caches locations in both memory and IndexedDB.
 * @param locations - An array of Location objects to cache.
 * @returns A promise that resolves when the locations have been cached.
 */
export async function cacheLocations(locations: Location[]): Promise<void> {
  if (locations.length === 0) {
    return;
  }

  for (const location of locations) {
    locationCache.set(location.id, location);
  }

  await appDb.locations.bulkPut(locations);
}
