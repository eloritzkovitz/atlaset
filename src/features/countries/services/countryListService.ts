import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@app/firebase";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { CountryList } from "../types";

/**
 * Service for managing user country lists.
 */
export const countryListService = {
  /**
   * Loads all country lists for the current user.
   * @returns A promise that resolves to an array of CountryList.
   */
  async load(): Promise<CountryList[]> {
    if (!isAuthenticated()) return [];
    const user = getCurrentUser();
    const listsCol = collection(db, "users", user!.uid, "countryLists");
    const snapshot = await getDocs(listsCol);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as CountryList,
    );
  },

  /**
   * Creates or updates a country list for the current user.
   * @param list - The CountryList to save.
   */
  async save(list: CountryList) {
    if (!isAuthenticated()) return;
    const user = getCurrentUser();
    const listRef = doc(db, "users", user!.uid, "countryLists", list.id);
    await setDoc(listRef, list);

    // Sync all saved map layers that reference this list to update their country codes
    const layersCol = collection(db, "users", user!.uid, "layers");
    const layersSnap = await getDocs(layersCol);
    for (const layerDoc of layersSnap.docs) {
      const layerData = layerDoc.data();
      if (layerData.listId === list.id) {
        await updateDoc(layerDoc.ref, { countries: list.countryCodes });
      }
    }

    // Also update any layers inside saved maps that reference this list
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    const mapsSnap = await getDocs(mapsCol);
    for (const mapDoc of mapsSnap.docs) {
      const mapData = mapDoc.data();
      if (Array.isArray(mapData.layers)) {
        let changed = false;
        const newLayers = mapData.layers.map((layer) => {
          if (layer && layer.listId === list.id) {
            changed = true;
            return { ...layer, countries: list.countryCodes };
          }
          return layer;
        });
        if (changed) {
          await updateDoc(mapDoc.ref, { layers: newLayers });
        }
      }
    }
  },

  /**
   * Deletes a country list for the current user.
   * @param id - The id of the CountryList to delete.
   */
  async delete(id: string) {
    if (!isAuthenticated()) return;
    const user = getCurrentUser();
    // Remove listId from any layers that reference this list
    const layersCol = collection(db, "users", user!.uid, "layers");
    const layersSnap = await getDocs(layersCol);
    for (const layerDoc of layersSnap.docs) {
      const layerData = layerDoc.data();
      if (layerData.listId === id) {
        await updateDoc(layerDoc.ref, { listId: null });
      }
    }

    // Remove listId from any layers inside saved maps
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    const mapsSnap = await getDocs(mapsCol);
    for (const mapDoc of mapsSnap.docs) {
      const mapData = mapDoc.data();
      if (Array.isArray(mapData.layers)) {
        let changed = false;
        const newLayers = mapData.layers.map((layer) => {
          if (layer && layer.listId === id) {
            changed = true;
            return { ...layer, listId: null };
          }
          return layer;
        });
        if (changed) {
          await updateDoc(mapDoc.ref, { layers: newLayers });
        }
      }
    }

    // Finally, delete the list
    const listRef = doc(db, "users", user!.uid, "countryLists", id);
    await deleteDoc(listRef);
  },
};
