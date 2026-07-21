import { appDb } from "@app/db";
import { countryListService } from "../../features/countries/services/countryListService";
import { layersService } from "../../features/atlas/layers/services/layersService";
import { markersService } from "../../features/atlas/markers/services/markersService";
import { settingsService } from "../../features/settings/common/services/settingsService";
import type { Settings } from "../../features/settings/types";
import type { BaseEntity, BaseService, LocalTable } from "./BaseService";

/** Migrates data from a local table to a Firestore service. */
async function migrateTable<T extends BaseEntity, TTable>(
  localTable: LocalTable<T>,
  service: BaseService<T, TTable>,
) {
  const guestData = await localTable.toArray();
  if (guestData.length === 0) return;

  for (const item of guestData) {
    await service.add(item);
  }

  await localTable.clear();
}

/** Service for handling data migration logic. */
export const migrationService = {
  /** Checks if any local guest data exists */
  async hasGuestData(): Promise<boolean> {
    const [lists, layers, markers, settings] = await Promise.all([
      appDb.countryLists.count(),
      appDb.layers.count(),
      appDb.markers.count(),
      appDb.settings.count(),
    ]);
    return lists + layers + markers + settings > 0;
  },

  /** Migrates all guest data to Firestore */
  async migrateGuestDataToFirestore(): Promise<void> {
    // Migrate each local table to its corresponding Firestore service
    await Promise.all([
      migrateTable(appDb.countryLists, countryListService),
      migrateTable(appDb.layers, layersService),
      migrateTable(appDb.markers, markersService),
    ]);

    // Migrate settings separately since it only has one entry
    const settings = await appDb.settings.get("main");
    if (settings) {
      await settingsService.save(settings as Settings);
      await appDb.settings.clear();
    }
  },
};
