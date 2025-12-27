import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { logUserActivity } from "../../../../features/user";
import { appDb } from "@utils/db";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { Marker } from "../types";
import { db } from "../../../../firebase";

/**
 * Service for managing user markers.
 */
export const markersService = {
  /**
   * Loads all markers for the current user.
   * @returns - A promise that resolves to an array of markers.
   */
  async load(): Promise<Marker[]> {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      const snapshot = await getDocs(markersCol);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Marker)
      );
    } else {
      return await appDb.markers.toArray();
    }
  },

  /**
   * Saves all markers, replacing existing ones.
   * @param markers - The array of markers to save.
   */
  async save(markers: Marker[]) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      // Clear all markers and re-add (batch)
      const batch = writeBatch(db);
      const snapshot = await getDocs(markersCol);
      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      markers.forEach((marker) => {
        const markerDoc = doc(markersCol, marker.id);
        batch.set(markerDoc, marker);
      });
      await batch.commit();
      await logUserActivity(
        220,
        {
          count: markers.length,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.markers.clear();
      if (markers.length > 0) {
        await appDb.markers.bulkAdd(markers);
      }
    }
  },

  /**
   * Adds a new marker.
   * @param marker - The marker to add.
   */
  async add(marker: Marker) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      await setDoc(doc(markersCol, marker.id), marker);
      await logUserActivity(
        221,
        {
          markerId: marker.id,
          itemName: marker.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.markers.add(marker);
    }
  },

  /**
   * Edits an existing marker.
   * @param marker - The marker to edit.
   */
  async edit(marker: Marker) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      await setDoc(doc(markersCol, marker.id), marker);
      await logUserActivity(
        222,
        {
          markerId: marker.id,
          itemName: marker.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.markers.put(marker);
    }
  },

  /**
   * Removes a marker by ID.
   * @param id - The ID of the marker to remove.
   */
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      const snapshot = await getDocs(markersCol);
      const markerDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
      const markerName = markerDoc ? markerDoc.data().name : undefined;
      await deleteDoc(doc(markersCol, id));
      await logUserActivity(
        223,
        {
          markerId: id,
          itemName: markerName,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.markers.delete(id);
    }
  },
};
