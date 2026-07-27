import { writeBatch } from "firebase/firestore";
import type { Layer } from "@features/atlas/layers";
import { appDb } from "@lib/db";
import {
  db,
  getCurrentUser,
  getDocsData,
  getPaths,
  isAuthenticated,
} from "@lib/firebase";
import { BaseService } from "@services/BaseService";
import type { CountryList } from "../types";
import type { SavedMap } from "@features/atlas/saved";

export class CountryListService extends BaseService<
  CountryList,
  typeof appDb.countryLists
> {
  protected readonly collectionName = "countryLists";
  protected readonly localTable = appDb.countryLists;

  /** Saves the list and cascades updates to layers/maps if authenticated. */
  async save(list: CountryList): Promise<void> {
    await super.add(list);

    if (!isAuthenticated()) return;

    const user = getCurrentUser();
    const uid = user!.uid;
    const batch = writeBatch(db);
    let hasUpdates = false;

    // Update Layers
    const layers = await getDocsData<Layer>(getPaths.sub(uid, "layers"));
    layers.forEach((l) => {
      if (l.listId === list.id) {
        const layerRef = getPaths.subDoc(uid, "layers", l.id);
        batch.update(layerRef, { countries: list.countryCodes });
        hasUpdates = true;
      }
    });

    // Update Maps
    const savedMaps = await getDocsData<SavedMap>(
      getPaths.sub(uid, "savedMaps"),
    );
    savedMaps.forEach((m) => {
      if (Array.isArray(m.layers)) {
        const newLayers = m.layers.map((l: Layer) =>
          l?.listId === list.id ? { ...l, countries: list.countryCodes } : l,
        );
        if (JSON.stringify(m.layers) !== JSON.stringify(newLayers)) {
          const mapRef = getPaths.subDoc(uid, "savedMaps", m.id);
          batch.update(mapRef, { layers: newLayers });
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) await batch.commit();
  }

  /** Deletes the list and clears references in layers/maps if authenticated. */
  async delete(list: CountryList): Promise<void> {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const uid = user!.uid;
      const batch = writeBatch(db);
      let hasUpdates = false;

      // Clear Layer refs
      const layers = await getDocsData<Layer>(getPaths.sub(uid, "layers"));
      layers.forEach((l) => {
        if (l.listId === list.id) {
          const layerRef = getPaths.subDoc(uid, "layers", l.id);
          batch.update(layerRef, { listId: null });
          hasUpdates = true;
        }
      });

      // Clear Map refs
      const savedMaps = await getDocsData<SavedMap>(
        getPaths.sub(uid, "savedMaps"),
      );
      savedMaps.forEach((m) => {
        if (Array.isArray(m.layers)) {
          const newLayers = m.layers.map((l: Layer) =>
            l?.listId === list.id ? { ...l, listId: null } : l,
          );
          if (JSON.stringify(m.layers) !== JSON.stringify(newLayers)) {
            const mapRef = getPaths.subDoc(uid, "savedMaps", m.id);
            batch.update(mapRef, { layers: newLayers });
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) await batch.commit();
    }

    await super.delete(list);
  }
}

export const countryListService = new CountryListService();
