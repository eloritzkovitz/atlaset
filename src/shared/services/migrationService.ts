import { appDb } from "@utils/db";
import { tripsService } from "./tripsService";
import { overlaysService } from "./overlaysService";
import { markersService } from "./markersService";
import { settingsService } from "./settingsService";

/**
 * Checks if there is any guest data in IndexedDB
 * @returns True if there is guest data, false otherwise
 */
export async function hasGuestData(): Promise<boolean> {
  const [markersCount, overlaysCount, settingsCount, tripsCount] =
    await Promise.all([
      appDb.markers.count(),
      appDb.overlays.count(),
      appDb.settings.count(),
      appDb.trips.count(),
    ]);
  return (
    markersCount > 0 || overlaysCount > 0 || settingsCount > 0 || tripsCount > 0
  );
}

// Migrate all guest data to Firestore for the authenticated user
export async function migrateGuestDataToFirestore() {
  // Migrate markers
  const markers = await appDb.markers.toArray();
  await markersService.save(markers);
  await appDb.markers.clear();

  // Migrate overlays
  const overlays = await appDb.overlays.toArray();
  await overlaysService.save(overlays);
  await appDb.overlays.clear();

  // Migrate settings
  const settings = await appDb.settings.get("main");
  if (settings) {
    await settingsService.save(settings);
    await appDb.settings.clear();
  }

  // Migrate trips
  const trips = await appDb.trips.toArray();
  await tripsService.save(trips);
  await appDb.trips.clear();
}
