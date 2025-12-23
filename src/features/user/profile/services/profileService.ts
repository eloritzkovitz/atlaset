import {
  doc,
  getDoc,
  runTransaction,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { logUserActivity } from "@utils/firebase";
import type { UserProfile } from "../../types";
import { db } from "../../../../firebase";

// Auto-generate a unique username from displayName or email
export async function generateUniqueUsername(
  displayName: string | null,
  email: string | null
): Promise<string> {
  const base = displayName
    ? displayName.toLowerCase().replace(/[^a-z0-9]/g, "")
    : email
    ? email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    : "user";
  let username = base;
  let suffix = 0;
  while (true) {
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) break;
    suffix++;
    username = `${base}${suffix}`;
  }
  return username;
}

// Create user profile and reserve username atomically
export async function createUserProfileWithUsername(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  joinDate?: string | null;
}) {
  const username = await generateUniqueUsername(user.displayName, user.email);

  // Use a transaction to ensure username uniqueness
  await runTransaction(db, async (transaction) => {
    const usernameRef = doc(db, "usernames", username);
    const userRef = doc(db, "users", username);
    const usernameSnap = await transaction.get(usernameRef);
    if (usernameSnap.exists()) {
      throw new Error("Username taken");
    }
    transaction.set(usernameRef, { uid: user.uid });
    transaction.set(userRef, {
      uid: user.uid,
      username,
      displayName: user.displayName || "",
      email: user.email || "",
      joinDate: user.joinDate
        ? Timestamp.fromDate(new Date(user.joinDate))
        : Timestamp.now(),
      photoURL: user.photoURL || "",
      bio: "",
      isPublic: true,
      homeCountry: "",
      visitedCountryCodes: [],
    });
  });
  return username;
}

// Fetch a user profile by UID
export async function getUserProfileByUid(
  uid: string
): Promise<UserProfile | null> {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return userSnap.data() as UserProfile;
}

// Fetch a user profile by username
export async function getUserProfileByUsername(
  username: string
): Promise<UserProfile | null> {
  // Return null if username is empty
  if (!username) return null;

  // 1. Get UID from usernames collection
  const usernameRef = doc(db, "usernames", username);
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) return null;
  const uid = usernameSnap.data().uid;

  // 2. Get user profile from users/{uid}
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  // Type assertion is safe if Firestore data matches UserProfile
  return userSnap.data() as UserProfile;
}

/**
 * Updates user profile fields in Firestore.
 * @param uid - The user's UID
 * @param updates - An object with the fields to update
 */
export async function editProfile(
  uid: string,
  updates: Partial<Record<string, any>>
) {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, updates);

  await logUserActivity(
    "edit_profile",
    { updatedFields: Object.keys(updates) },
    uid
  );
}

// Change username atomically
export async function changeUsername({
  uid,
  oldUsername,
  newUsername,
}: {
  uid: string;
  oldUsername: string;
  newUsername: string;
}) {
  // Clean new username
  const cleanUsername = newUsername.toLowerCase().replace(/[^a-z0-9]/g, "");
  await runTransaction(db, async (transaction) => {
    const newUsernameRef = doc(db, "usernames", cleanUsername);
    const oldUsernameRef = doc(db, "usernames", oldUsername);
    const userRef = doc(db, "users", uid);
    const usernameSnap = await transaction.get(newUsernameRef);
    if (usernameSnap.exists()) {
      throw new Error("Username taken");
    }
    // Update username field in user doc
    transaction.update(userRef, { username: cleanUsername });
    // Create new username doc
    transaction.set(newUsernameRef, { uid });
    // Delete old username doc
    transaction.delete(oldUsernameRef);
  });
  return cleanUsername;
}

// Get home country for a given user ID
export async function getHomeCountry(uid: string): Promise<string> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() && userSnap.data().homeCountry
    ? userSnap.data().homeCountry
    : "";
}

// Set home country for a given user ID
export async function setHomeCountry(uid: string, country: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { homeCountry: country });
}
