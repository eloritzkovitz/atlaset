import { BaseService } from "@services/BaseService";
import type { SavedMap } from "../types";
import { isAuthenticated } from "@utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const snapshot = await getDoc(doc(this.getColRef(), id));
    return snapshot.exists()
      ? ({ id: snapshot.id, ...snapshot.data() } as SavedMap)
      : null;
  }

  /** Saves a saved map. */
  async set(map: SavedMap): Promise<void> {
    if (!isAuthenticated()) throw new Error("Authentication required");
    await setDoc(doc(this.getColRef(), map.id), map, { merge: true });
  }
}

export const savedMapsService = new SavedMapsService();
