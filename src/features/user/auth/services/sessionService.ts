import {
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
  type WithFieldValue,
  type DocumentData,
} from "firebase/firestore";
import { getDocsData, getPaths, getUserCollection } from "@lib/firebase";
import {
  getBrowserSessionInfo,
  getOrCreateSessionId,
  clearLocalSession,
} from "../utils/session";
import type { UserSession } from "../../types";

/** Service for managing session information. */
export const sessionService = {
  /** Fetches all tracked sessions for a given user ordered by activity. */
  async fetchUserSessions(userId: string): Promise<UserSession[]> {
    const sessionsCol = getPaths.sub(userId, "sessions");
    const q = query(
      sessionsCol,
      where("userId", "==", userId),
      orderBy("lastActive", "desc"),
    );

    return await getDocsData<UserSession>(q);
  },

  /** Registers a new session in Firestore. */
  async logSession(userId: string): Promise<void> {
    const sessionInfo = getBrowserSessionInfo();
    const sessionId = getOrCreateSessionId();
    const sessionsCol = getPaths.sub(userId, "sessions");

    // Check if this browser already has a session document registered for this user
    const q = query(
      sessionsCol,
      where("userId", "==", userId),
      where("sessionId", "==", sessionId),
    );

    const snapshot = await getDocs(q);

    const payload = {
      ...sessionInfo,
      lastActive: Date.now(),
      userId,
      sessionId,
    };

    let targetDocId = "";

    // If a session document already exists for this browser, update it; otherwise, create a new one
    if (!snapshot.empty) {
      const existingDocRef = snapshot.docs[0].ref;
      targetDocId = existingDocRef.id;

      await updateDoc(existingDocRef, payload as WithFieldValue<DocumentData>);
    } else {
      const newDocRef = await addDoc(sessionsCol, {
        ...payload,
        ipAddress: "Loading...",
        location: "Loading...",
      } as WithFieldValue<DocumentData>);

      targetDocId = newDocRef.id;
    }

    // Asynchronously fetch and update IP and Geolocation data without blocking the main flow
    this.enrichSessionWithGeoData(userId, targetDocId);
  },

  /** Quietly fetches IP and Geolocation in the background and patches the document. */
  async enrichSessionWithGeoData(userId: string, docId: string): Promise<void> {
    try {
      const response = await fetch("https://ipwho.is/");
      if (!response.ok) return;

      const data = await response.json();

      const ipAddress = data.ip || "Unknown IP";
      const location =
        data.city && data.country
          ? `${data.city}, ${data.country}`
          : data.country || "Unknown Location";

      const docRef = getPaths.subDoc(userId, "sessions", docId);

      await updateDoc(docRef, {
        ipAddress,
        location,
      });
    } catch (error) {
      console.error("Failed to quietly enrich session metadata:", error);
    }
  },

  /** Updates the last active timestamp of the current browser session. */
  async updateCurrentSession(userId: string): Promise<void> {
    const sessionId = getOrCreateSessionId();

    const sessionsCol = getPaths.sub(userId, "sessions");
    const q = query(
      sessionsCol,
      where("userId", "==", userId),
      where("sessionId", "==", sessionId),
    );

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

  /** Removes a specific session document from Firestore by its unique document ID. */
  async removeSessionById(id: string): Promise<void> {
    const sessionsCol = getUserCollection("sessions");
    await deleteDoc(doc(sessionsCol, id));
  },

  /** Terminates an active session matching the provided user ID and unique session token. */
  async terminateSession(userId: string, sessionId?: string): Promise<void> {
    const targetSessionId = sessionId || getOrCreateSessionId();
    const sessionsCol = getPaths.sub(userId, "sessions");
    const q = query(
      sessionsCol,
      where("userId", "==", userId),
      where("sessionId", "==", targetSessionId),
    );

    const snapshot = await getDocs(q);
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(docSnapshot.ref);
    }

    if (!sessionId || sessionId === getOrCreateSessionId()) {
      clearLocalSession();
    }
  },
};
