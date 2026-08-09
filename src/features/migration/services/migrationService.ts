import { countryListService } from "@features/atlas/countries/services/countryListService";
import { layersService } from "@features/atlas/layers/services/layersService";
import { markersService } from "@features/atlas/markers/services/markersService";
import { settingsService } from "@features/settings/core/services/settingsService";
import type { Settings } from "@features/settings/types";
import { appDb } from "@lib/db";
import { getDocData, getPaths } from "@lib/firebase";
import type {
  BaseEntity,
  BaseService,
  LocalTable,
} from "@services/BaseService";

/** Migrates data from a local table to a Firestore service. */
async function migrateTable<T extends BaseEntity, TTable>(
  localTable: LocalTable<T>,
  service: BaseService<T, TTable>,
) {
  const items = await localTable.toArray();

  if (items.length === 0) return;

  for (const item of items) {
    await service.add(item);
  }

  await localTable.clear();
}

/** Service for handling data migration logic. */
export const migrationService = {
  /** Checks if any local data exists */
  async hasLocalData(): Promise<boolean> {
    const [lists, layers, markers, settings] = await Promise.all([
      appDb.countryLists.count(),
      appDb.layers.count(),
      appDb.markers.count(),
      appDb.settings.count(),
    ]);
    return lists + layers + markers + settings > 0;
  },

  /** Clears all local data from storage */
  async clearLocalData(): Promise<void> {
    await Promise.all([
      appDb.countryLists.clear(),
      appDb.layers.clear(),
      appDb.markers.clear(),
      appDb.settings.clear(),
    ]);
  },

  /** Migrates all local data to Firestore */
  async migrate(userId: string): Promise<void> {
    await Promise.all([
      migrateTable(appDb.countryLists, countryListService),
      migrateTable(appDb.layers, layersService),
      migrateTable(appDb.markers, markersService),
    ]);

    const localSettings = await appDb.settings.get("main");

    if (localSettings) {
      const existingSettings = await getDocData<Settings>(
        getPaths.settingsDoc(userId),
      );

      // Preserve existing account settings.
      if (!existingSettings) {
        await settingsService.save(localSettings as Settings);
      }
    }

    await this.clearLocalData();
  },
};
