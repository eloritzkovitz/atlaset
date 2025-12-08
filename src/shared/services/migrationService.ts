import { appDb } from "@utils/db";
import { markersService } from "../../features/atlas/markers/services/markersService";
import { overlaysService } from "../../features/atlas/overlays/services/overlaysService";
import { settingsService } from "../../features/settings/services/settingsService";
import { tripsService } from "../../features/trips/services/tripsService";

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
  const guestMarkers = await appDb.markers.toArray();
  const userMarkers = await markersService.load();
  const mergedMarkers = [
    ...guestMarkers,
    ...userMarkers.filter((m) => !guestMarkers.some((g) => g.id === m.id)),
  ];
  await markersService.save(mergedMarkers);
  await appDb.markers.clear();

  // Migrate overlays
  const guestOverlays = await appDb.overlays.toArray();
  const userOverlays = await overlaysService.load();
  const mergedOverlays = [
    ...guestOverlays,
    ...userOverlays.filter((o) => !guestOverlays.some((g) => g.id === o.id)),
  ];
  await overlaysService.save(mergedOverlays);
  await appDb.overlays.clear();

  // Migrate settings
  const settings = await appDb.settings.get("main");
  if (settings) {
    await settingsService.save(settings);
    await appDb.settings.clear();
  }

  // Migrate trips
  const guestTrips = await appDb.trips.toArray();
  const userTrips = await tripsService.load();
  const mergedTrips = [
    ...guestTrips,
    ...userTrips.filter((t) => !guestTrips.some((g) => g.id === t.id)),
  ];
  await tripsService.save(mergedTrips);
  await appDb.trips.clear();
}
