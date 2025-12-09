/**
 * @file Device utilities for user authentication.
 */

import {
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getUserCollection } from "@utils/firebase";

/**
 * Gathers device information from the browser.
 * @returns An object containing device information.
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
  };
}

/**
 * Gets or creates a unique session ID for the current browser session.
 * @returns The session ID.
 */
export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

/**
 * Logs device information to Firestore.
 * @param userId The ID of the user.
 */
export async function logDevice(userId: string) {
  const deviceInfo = getDeviceInfo();
  const sessionId = getOrCreateSessionId();
  const devicesCol = getUserCollection("devices");
  await addDoc(devicesCol, {
    ...deviceInfo,
    lastActive: Date.now(),
    userId,
    sessionId,
  });
}

/**
 * Updates the last active timestamp of the current device in Firestore.
 * @param userId - The ID of the user.
 */
export async function updateCurrentDevice(userId: string) {
  const sessionId = getOrCreateSessionId();
  const devicesCol = getUserCollection("devices");
  const q = query(
    devicesCol,
    where("userId", "==", userId),
    where("sessionId", "==", sessionId)
  );
  const snapshot = await getDocs(q);
  for (const doc of snapshot.docs) {
    await updateDoc(doc.ref, { lastActive: Date.now() });
  }
}

/**
 * Removes the current device from the user's devices in Firestore.
 * @param userId - The ID of the user.
 */
export async function removeCurrentDevice(userId: string) {
  const sessionId = getOrCreateSessionId();
  const devicesCol = getUserCollection("devices");
  const q = query(
    devicesCol,
    where("userId", "==", userId),
    where("sessionId", "==", sessionId)
  );
  const snapshot = await getDocs(q);
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
  localStorage.removeItem("sessionId");
}
