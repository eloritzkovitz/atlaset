import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { logUserActivity } from "@features/user";
import { db } from "@firebase";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { SavedMap } from "../types";

/**
 * Service for managing user saved exported maps.
 */
export const savedMapsService = {
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
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      } as SavedMap;
    });
  },

  /**
   * Loads a single saved map by id for the current user.
   * @param id The id of the saved map
   * @returns The SavedMap or null if not found
   */
  async get(id: string): Promise<SavedMap | null> {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to load saved maps.");
    const user = getCurrentUser();
    const mapDoc = doc(collection(db, "users", user!.uid, "savedMaps"), id);
    const snapshot = await getDoc(mapDoc);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return { id: snapshot.id, ...data } as SavedMap;
  },

  /**
   * Creates or updates a saved map by id.
   * @param map - The map to create or update.
   */
  async set(map: SavedMap) {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to save maps.");
    const user = getCurrentUser();
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    await setDoc(doc(mapsCol, map.id), map, { merge: true });
    await logUserActivity(
      232,
      {
        mapId: map.id,
        mapName: map.name,
        userName: user!.displayName,
      },
      user!.uid,
    );
  },

  /**
   * Adds a new saved map.
   * @param map - The map to save.
   */
  async add(map: SavedMap) {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to save maps.");
    const user = getCurrentUser();
    const mapsCol = collection(db, "users", user!.uid, "savedMaps");
    // Save layers as-is; assume ids are already valid
    await setDoc(doc(mapsCol, map.id), map);
    await logUserActivity(
      231,
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
      233,
      {
        mapId: id,
        userName: user!.displayName,
      },
      user!.uid,
    );
  },
};
