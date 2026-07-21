import { doc, setDoc } from "firebase/firestore";
import { getDocData, isAuthenticated } from "@lib/firebase";
import { BaseService } from "@services/BaseService";
import type { SavedMap } from "../types";

/** Service for managing saved maps. */
export class SavedMapsService extends BaseService<SavedMap, undefined> {
  protected readonly collectionName = "savedMaps";
  protected readonly localTable = undefined;

  /** Loads all saved maps. */
  async load(): Promise<SavedMap[]> {
    if (!isAuthenticated())
      throw new Error("User must be authenticated to load saved maps.");
    return super.load();
  }

  /** Gets a saved map by its ID. */
  async get(id: string): Promise<SavedMap | null> {
    if (!isAuthenticated()) throw new Error("Authentication required");
    const ref = doc(this.getColRef(), id);
    return await getDocData<SavedMap>(ref);
  }

  /** Saves a saved map. */
  async set(map: SavedMap): Promise<void> {
    if (!isAuthenticated()) throw new Error("Authentication required");
    const { id, ...data } = map;
    return await setDoc(doc(this.getColRef(), id), data, { merge: true });
  }
}

export const savedMapsService = new SavedMapsService();
