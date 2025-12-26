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
import { logUserActivity } from "../../../../features/user";
import { appDb } from "@utils/db";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import type { AnyOverlay } from "../types";
import { db } from "../../../../firebase";

/**
 * Service for managing user overlays.
 */
export const overlaysService = {
  /**
   * Loads all overlays for the current user.
   * @returns A promise that resolves to an array of overlays.
   */
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

  /**
   * Saves all overlays, replacing existing ones.
   * @param overlays - The array of overlays to save.
   */
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
      await logUserActivity(
        210,
        {
          count: overlays.length,
          userName: user!.displayName,
        },
        user!.uid
      );
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

  /**
   * Adds a new overlay.
   * @param overlay - The overlay to add.
   */
  async add(overlay: AnyOverlay) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      await setDoc(doc(overlaysCol, overlay.id), overlay);
      await logUserActivity(
        211,
        {
          overlayId: overlay.id,
          itemName: overlay.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.overlays.add(overlay);
    }
  },

  /**
   * Edits an existing overlay.
   * @param overlay - The overlay to edit.
   */
  async edit(overlay: AnyOverlay) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      await setDoc(doc(overlaysCol, overlay.id), overlay);
      await logUserActivity(
        212,
        {
          overlayId: overlay.id,
          itemName: overlay.name,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.overlays.put(overlay);
    }
  },

  /**
   * Removes an overlay by ID.
   * @param id - The ID of the overlay to remove.
   */
  async remove(id: string) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const overlaysCol = collection(db, "users", user!.uid, "overlays");
      const snapshot = await getDocs(overlaysCol);
      const overlayDoc = snapshot.docs.find((docSnap) => docSnap.id === id);
      const overlayName = overlayDoc ? overlayDoc.data().name : undefined;
      await deleteDoc(doc(overlaysCol, id));
      await logUserActivity(
        213,
        {
          overlayId: id,
          itemName: overlayName,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.overlays.delete(id);
    }
  },
};
