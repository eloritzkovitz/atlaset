import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { SavedMap } from "../types";
import { db } from "../../../../firebase";
import { logUserActivity } from "../../../../features/user";

/**
 * Service for managing user saved exported maps.
 */
export const exportSaveService = {
  /**
   * Adds a new saved map.
   * @param map - The map to save.
   */
  async add(map: SavedMap) {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to save maps.");
    const user = getCurrentUser();
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    await setDoc(doc(mapsCol, map.id), map);
    await logUserActivity(
      331,
      {
        mapId: map.id,
        mapName: map.name,
        userName: user!.displayName,
      },
      user!.uid,
    );
  },

  /**
   * Deletes a saved map by ID.
   * @param id - The ID of the map to delete.
   */
  async delete(id: string) {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to delete maps.");
    const user = getCurrentUser();
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    await deleteDoc(doc(mapsCol, id));
    await logUserActivity(
      333,
      {
        mapId: id,
        userName: user!.displayName,
      },
      user!.uid,
    );
  },

  /**
   * Loads all saved maps for the current user.
   * @returns A promise that resolves to an array of saved maps.
   */
  async load(): Promise<SavedMap[]> {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to load saved maps.");
    const user = getCurrentUser();
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    const snapshot = await getDocs(mapsCol);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as SavedMap,
    );
  },
};
