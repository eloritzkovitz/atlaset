import { getDocs, writeBatch, collection } from "firebase/firestore";
import { appDb } from "@app/db";
import { db } from "@app/firebase";
import type { Layer } from "@features/atlas/layers";
import { getCurrentUser, isAuthenticated } from "@lib/firebase";
import { BaseService } from "@services/BaseService";
import type { CountryList } from "../types";

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
    const batch = writeBatch(db);
    let hasUpdates = false;

    // Update Layers
    const layersSnap = await getDocs(
      collection(db, "users", user!.uid, "layers"),
    );
    layersSnap.docs.forEach((d) => {
      if (d.data().listId === list.id) {
        batch.update(d.ref, { countries: list.countryCodes });
        hasUpdates = true;
      }
    });

    // Update Maps
    const mapsSnap = await getDocs(
      collection(db, "users", user!.uid, "savedMaps"),
    );
    mapsSnap.docs.forEach((d) => {
      const mapData = d.data();
      if (Array.isArray(mapData.layers)) {
        const newLayers = mapData.layers.map((l: Layer) =>
          l?.listId === list.id ? { ...l, countries: list.countryCodes } : l,
        );
        if (JSON.stringify(mapData.layers) !== JSON.stringify(newLayers)) {
          batch.update(d.ref, { layers: newLayers });
          hasUpdates = true;
        }
      }
    });

    if (hasUpdates) await batch.commit();
  }

  /** Deletes the list and clears references in layers/maps if authenticated. */
  async delete(id: string): Promise<void> {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const batch = writeBatch(db);
      let hasUpdates = false;

      // Clear Layer refs
      const layersSnap = await getDocs(
        collection(db, "users", user!.uid, "layers"),
      );
      layersSnap.docs.forEach((d) => {
        if (d.data().listId === id) {
          batch.update(d.ref, { listId: null });
          hasUpdates = true;
        }
      });

      // Clear Map refs
      const mapsSnap = await getDocs(
        collection(db, "users", user!.uid, "savedMaps"),
      );
      mapsSnap.docs.forEach((d) => {
        const mapData = d.data();
        if (Array.isArray(mapData.layers)) {
          const newLayers = mapData.layers.map((l: Layer) =>
            l?.listId === id ? { ...l, listId: null } : l,
          );
          if (JSON.stringify(mapData.layers) !== JSON.stringify(newLayers)) {
            batch.update(d.ref, { layers: newLayers });
            hasUpdates = true;
          }
        }
      });

      if (hasUpdates) await batch.commit();
    }

    await super.delete(id);
  }
}

export const countryListService = new CountryListService();
