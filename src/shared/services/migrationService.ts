import { appDb } from "@utils/db";
import { layersService } from "../../features/atlas/layers/services/layersService";
import { markersService } from "../../features/atlas/markers/services/markersService";
import { settingsService } from "../../features/settings/services/settingsService";
import { tripsService } from "../../features/trips/services/tripsService";
import type { Settings } from "../../features/settings/types";

/**
 * Service for migrating guest data to Firestore
 */
export const migrationService = {
  /**
   * Checks if there is any guest data in IndexedDB
   * @returns True if there is guest data, false otherwise
   */
  async hasGuestData(): Promise<boolean> {
    const [layerysCount, markersCount, settingsCount, tripsCount] =
      await Promise.all([
        appDb.layers.count(),
        appDb.markers.count(),        
        appDb.settings.count(),
        appDb.trips.count(),
      ]);
    return (
      markersCount > 0 ||
      layerysCount > 0 ||
      settingsCount > 0 ||
      tripsCount > 0
    );
  },

  /**
   * Migrates guest data from IndexedDB to Firestore for the authenticated user
   */
  async migrateGuestDataToFirestore() {
    // Migrate markers
    const guestMarkers = await appDb.markers.toArray();
    const userMarkers = await markersService.load();
    const mergedMarkers = [
      ...guestMarkers,
      ...userMarkers.filter((m) => !guestMarkers.some((g) => g.id === m.id)),
    ];
    await markersService.save(mergedMarkers);
    await appDb.markers.clear();

    // Migrate layers
    const guestLayers = await appDb.layers.toArray();
    const userLayers = await layersService.load();
    const mergedLayers = [
      ...guestLayers,
      ...userLayers.filter((o) => !guestLayers.some((g) => g.id === o.id)),
    ];
    await layersService.save(mergedLayers);
    await appDb.layers.clear();

    // Migrate settings
    const settings = await appDb.settings.get("main");
    if (
      settings &&
      typeof settings === "object" &&
      "id" in settings &&
      "account" in settings &&
      "display" in settings &&
      "map" in settings &&
      "layers" in settings
    ) {
      await settingsService.save(settings as Settings);
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
  },
};
