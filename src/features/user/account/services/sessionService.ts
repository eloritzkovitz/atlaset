import {
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  updateDoc,
  type WithFieldValue,
  type DocumentData,
} from "firebase/firestore";
import { getDocsData, getPaths } from "@lib/firebase";
import { geoService } from "@lib/geo";
import { isLocalhost } from "@utils";
import type { UserSession } from "../types";
import { getBrowserSessionInfo, getOrCreateSessionId } from "../utils/session";

/** Service for managing session information. */
export const sessionService = {
  /** Fetches all tracked sessions for a given user ordered by activity. */
  async fetchUserSessions(userId: string): Promise<UserSession[]> {
    const sessionsCol = getPaths.sub(userId, "sessions");

    const q = query(sessionsCol, orderBy("lastActive", "desc"));

    return getDocsData<UserSession>(q);
  },

  /** Registers a new session in Firestore. */
  async logSession(userId: string): Promise<void> {
    const sessionInfo = getBrowserSessionInfo();
    const sessionId = getOrCreateSessionId();
    const sessionsCol = getPaths.sub(userId, "sessions");

    const q = query(sessionsCol, where("sessionId", "==", sessionId));
    const snapshot = await getDocs(q);
    const isLocal = isLocalhost();

    const payload = {
      ...sessionInfo,
      lastActive: Date.now(),
      userId,
      sessionId,
    };

    let targetDocId: string;

    // If a session document already exists for this browser, update it; otherwise, create a new one
    if (!snapshot.empty) {
      const existingDocRef = snapshot.docs[0].ref;
      targetDocId = existingDocRef.id;

      await updateDoc(existingDocRef, payload as WithFieldValue<DocumentData>);
    } else {
      const newDocRef = await addDoc(sessionsCol, {
        ...payload,
        ipAddress: isLocal ? "127.0.0.1" : "Loading...",
        location: isLocal ? "localhost" : "Loading...",
      } as WithFieldValue<DocumentData>);

      targetDocId = newDocRef.id;
    }

    // Asynchronously fetch and update IP and Geolocation data without blocking the main flow
    this.enrichSessionMetadata(userId, targetDocId);
  },

  /** Enriches a session document with IP and Geolocation data. */
  async enrichSessionMetadata(userId: string, docId: string): Promise<void> {
    try {
      const docRef = getPaths.subDoc(userId, "sessions", docId);

      // If running on localhost, set IP and location to localhost values
      if (isLocalhost()) {
        await updateDoc(docRef, {
          ipAddress: "127.0.0.1",
          location: "localhost",
        });
        return;
      }

      // Fetch geolocation data from the geoService
      const geoData = await geoService.getGeoData();
      if (!geoData) return;

      await updateDoc(docRef, {
        ipAddress: geoData.ipAddress,
        location: geoData.location,
      });
    } catch (error) {
      console.error("Failed to quietly enrich session metadata:", error);
    }
  },

  /** Updates the last active timestamp of the current browser session. */
  async updateCurrentSession(userId: string): Promise<void> {
    const sessionId = getOrCreateSessionId();
    const sessionsCol = getPaths.sub(userId, "sessions");

    const q = query(sessionsCol, where("sessionId", "==", sessionId));

    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          lastActive: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to update current session activity:", error);
    }
  },

  /** Terminates a session by deleting the corresponding document in Firestore. */
  async terminateSession(userId: string, sessionDocId: string): Promise<void> {
    const docRef = getPaths.subDoc(userId, "sessions", sessionDocId);

    await deleteDoc(docRef);
  },

  /** Terminates the current browser's tracked session. */
  async terminateCurrentSession(userId: string): Promise<void> {
    const sessionId = getOrCreateSessionId();
    const sessionsCol = getPaths.sub(userId, "sessions");

    const q = query(sessionsCol, where("sessionId", "==", sessionId));

    const snapshot = await getDocs(q);

    await Promise.all(
      snapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref)),
    );
  },
};
