import {
  doc,
  getDoc,
  runTransaction,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { logUserActivity } from "../../activity/utils/activity";
import type { UserProfile } from "../../types";
import { db } from "../../../../firebase";

/**
 * Service for managing user profiles.
 */
export const profileService = {
  /**
   * Checks if a username already exists in Firestore.
   * @param username - The username to check.
   * @returns - True if the username exists, false otherwise.
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    if (!username) return false;
    const usernameRef = doc(db, "usernames", username);
    const usernameSnap = await getDoc(usernameRef);
    return usernameSnap.exists();
  },

  /**
   * Generates a unique username based on display name or email.
   * @param displayName - The user's display name.
   * @param email = - The user's email.
   * @returns A unique username.
   */
  async generateUniqueUsername(
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
      if (!(await this.checkUsernameExists(username))) break;
      suffix++;
      username = `${base}${suffix}`;
    }
    return username;
  },

  /**
   * Creates a user profile in Firestore with a unique username.
   * @param user - The user object containing uid, displayName, email, etc.
   * @returns - The generated unique username.
   */
  async createUserProfileWithUsername(user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL?: string | null;
    joinDate?: string | null;
  }) {
    const username = await this.generateUniqueUsername(
      user.displayName,
      user.email
    );

    // Use a transaction to ensure username uniqueness
    await runTransaction(db, async (transaction) => {
      const usernameRef = doc(db, "usernames", username);
      const userRef = doc(db, "users", user.uid);
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
  },

  /**
   * Fetches a user profile by UID.
   * @param uid = The user ID.
   * @returns = The UserProfile object or null if not found.
   */
  async getUserProfileByUid(uid: string): Promise<UserProfile | null> {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return userSnap.data() as UserProfile;
  },

  /**
   * Fetches a user profile by username.
   * @param username - The username.
   * @returns - The UserProfile object or null if not found.
   */
  async getUserProfileByUsername(
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
  },

  /**
   * Updates user profile fields in Firestore.
   * @param uid - The user's UID
   * @param updates - An object with the fields to update
   */
  async editProfile(uid: string, updates: Partial<UserProfile>) {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, updates);

    // Fetch username for activity details
    let username = updates.username;
    if (!username) {
      const userSnap = await getDoc(userDocRef);
      username = userSnap.exists() ? userSnap.data().username : undefined;
    }

    await logUserActivity(
      120,
      {
        updatedFields: Object.keys(updates),
        userName: username || "",
      },
      uid
    );
  },

  /**
   * Changes a user's username in Firestore.
   * @param uid - The user's UID.
   * @param oldUsername - The user's current username.
   * @param newUsername - The desired new username.
   * @returns - The new username if successful.
   */
  async changeUsername({
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
  },

  /**
   * Gets home country for a given user ID.
   * @param uid - The user ID.
   * @returns - The home country as a string.
   */
  async getHomeCountry(uid: string): Promise<string> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() && userSnap.data().homeCountry
      ? userSnap.data().homeCountry
      : "";
  },

  /** * Sets the home country for a given user ID.
   * @param uid - The user ID.
   * @param country - The country to set as home.
   */
  async setHomeCountry(uid: string, country: string) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { homeCountry: country });
  },
};
