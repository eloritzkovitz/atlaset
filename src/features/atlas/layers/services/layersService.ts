import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { appDb } from "@db";
import { db } from "@firebase";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { AnyLayer } from "../types";
import { logUserActivity } from "../../../user";

/**
 * Service for managing user layers.
 */
export const layersService = {
  /**
   * Loads all layers for the current user.
   * @returns A promise that resolves to an array of layers.
   */
  async load(): Promise<AnyLayer[]> {
    let layers: AnyLayer[];
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      const snapshot = await getDocs(layersCol);
      layers = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as AnyLayer,
      );
    } else {
      layers = await appDb.layers.toArray();
    }
    layers = layers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return layers;
  },

  /**
   * Saves all layers, replacing existing ones.
   * @param layers - The array of layers to save.
   */
  async save(layers: AnyLayer[]) {
    if (isAuthenticated()) {
      // Prevent accidental wipe
      if (!layers || layers.length === 0) {
        console.warn(
          "Attempted to save empty layers array. Aborting to prevent data loss.",
        );
        return;
      }
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      // Clear all layers and re-add (batch)
      const batch = writeBatch(db);
      const snapshot = await getDocs(layersCol);
      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      layers.forEach((layer) => {
        const layerDoc = doc(layersCol, layer.id);
        batch.set(layerDoc, layer);
      });
      await batch.commit();
      await logUserActivity(
        210,
        {
          count: layers.length,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      if (!layers || layers.length === 0) {
        console.warn(
          "Attempted to save empty layers array. Aborting to prevent data loss.",
        );
        return;
      }
      await appDb.layers.clear();
      await appDb.layers.bulkPut(layers);
    }
  },

  /**
   * Adds a new layer.
   * @param layer - The layer to add.
   */
  async add(layer: AnyLayer) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      await setDoc(doc(layersCol, layer.id), layer);
      await logUserActivity(
        211,
        {
          layerId: layer.id,
          itemName: layer.name,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      await appDb.layers.add(layer);
    }
  },

  /**
   * Edits an existing layer.
   * @param layer - The layer to edit.
   */
  async edit(layer: AnyLayer) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      await setDoc(doc(layersCol, layer.id), layer);
      await logUserActivity(
        212,
        {
          layerId: layer.id,
          itemName: layer.name,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      await appDb.layers.put(layer);
    }
  },

  /**
   * Batch update layers' order field only for layers whose order changed.
   * @param layers - Array of layers with updated order.
   */
  async reorder(layers: AnyLayer[]) {
    if (!layers || layers.length === 0) return;
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      const batch = writeBatch(db);
      layers.forEach((layer) => {
        const layerDoc = doc(layersCol, layer.id);
        batch.update(layerDoc, { order: layer.order });
      });
      await batch.commit();
      await logUserActivity(
        214,
        {
          count: layers.length,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      // IndexedDB: update layers' order field only
      for (const layer of layers) {
        await appDb.layers.update(layer.id, { order: layer.order });
      }
    }
  },

  /**
   * Removes a layer by ID.
   * @param id - The ID of the layer to remove.
   */
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const layersCol = collection(db, "users", user!.uid, "layers");
      const snapshot = await getDocs(layersCol);
      const layerDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
      const layerName = layerDoc ? layerDoc.data().name : undefined;
      await deleteDoc(doc(layersCol, id));
      await logUserActivity(
        213,
        {
          layerId: id,
          itemName: layerName,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      await appDb.layers.delete(id);
    }
  },
};
