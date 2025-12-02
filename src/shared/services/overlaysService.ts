import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import {
  VISITED_OVERLAY_ID,
  DEFAULT_VISITED_OVERLAY,
} from "@constants/overlays";
import type { AnyOverlay } from "@types";
import { appDb } from "@utils/db";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import { db } from "../../firebase";

export const overlaysService = {
  // Load all overlays from Firestore or IndexedDB
  async load(): Promise<AnyOverlay[]> {
    let overlays: AnyOverlay[];
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      const snapshot = await getDocs(overlaysCol);
      overlays = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as AnyOverlay)
      );
    } else {
      overlays = await appDb.overlays.toArray();
    }
    overlays = overlays.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    // Ensure visited overlay exists
    if (!overlays.some((o) => o.id === VISITED_OVERLAY_ID)) {
      overlays.unshift({ ...DEFAULT_VISITED_OVERLAY });
    }
    return overlays;
  },

  // Save overlays to Firestore or IndexedDB
  async save(overlays: AnyOverlay[]) {
    if (isAuthenticated()) {
      // Prevent accidental wipe
      if (!overlays || overlays.length === 0) {
        console.warn(
          "Attempted to save empty overlays array. Aborting to prevent data loss."
        );
        return;
      }
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      // Clear all overlays and re-add (batch)
      const batch = writeBatch(db);
      const snapshot = await getDocs(overlaysCol);
      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      overlays.forEach((overlay) => {
        const overlayDoc = doc(overlaysCol, overlay.id);
        batch.set(overlayDoc, overlay);
      });
      await batch.commit();
    } else {
      if (!overlays || overlays.length === 0) {
        console.warn(
          "Attempted to save empty overlays array. Aborting to prevent data loss."
        );
        return;
      }
      await appDb.overlays.clear();
      await appDb.overlays.bulkPut(overlays);
    }
  },

  // Add a new overlay
  async add(overlay: AnyOverlay) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      await setDoc(doc(overlaysCol, overlay.id), overlay);
    } else {
      await appDb.overlays.add(overlay);
    }
  },

  // Edit an existing overlay
  async edit(overlay: AnyOverlay) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      await setDoc(doc(overlaysCol, overlay.id), overlay);
    } else {
      await appDb.overlays.put(overlay);
    }
  },

  // Remove an overlay by ID
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      await deleteDoc(doc(overlaysCol, id));
    } else {
      await appDb.overlays.delete(id);
    }
  },
};
