import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import type { Marker } from "@types";
import { appDb } from "@utils/db";
import {
  isAuthenticated,
  getCurrentUser,
  logUserActivity,
} from "@utils/firebase";
import { db } from "../../../../firebase";

export const markersService = {
  // Load all markers from Firestore or IndexedDB
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

  // Save markers to Firestore or IndexedDB
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
      await logUserActivity("save_markers", { count: markers.length });
    } else {
      await appDb.markers.clear();
      if (markers.length > 0) {
        await appDb.markers.bulkAdd(markers);
      }
    }
  },

  // Add a new marker
  async add(marker: Marker) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      await setDoc(doc(markersCol, marker.id), marker);
      await logUserActivity("add_marker", { markerId: marker.id });
    } else {
      await appDb.markers.add(marker);
    }
  },

  // Edit marker by id
  async edit(marker: Marker) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      await setDoc(doc(markersCol, marker.id), marker);
      await logUserActivity("edit_marker", { markerId: marker.id });
    } else {
      await appDb.markers.put(marker);
    }
  },

  // Remove marker by id
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const markersCol = collection(db, "users", user!.uid, "markers");
      await deleteDoc(doc(markersCol, id));
      await logUserActivity("remove_marker", { markerId: id });
    } else {
      await appDb.markers.delete(id);
    }
  },
};
