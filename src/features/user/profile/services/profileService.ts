import { doc, runTransaction, updateDoc } from "firebase/firestore";
import { logUserActivity } from "@features/activity";
import type { Trip } from "@features/trips/types";
import { computeVisitedCountriesFromTrips } from "@features/visits/utils/visits";
import { db, getDocData, getDocsData, getPaths } from "@lib/firebase";
import { geoService } from "@lib/geo";
import type { UserProfile } from "../types";

// Normalizes a username by converting to lowercase and removing special characters
const normalizeUsername = (username: string) =>
  username.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Service for managing user profiles.
 */
export const profileService = {
  /**
   * Fetches a user profile by UID.
   * @param uid - The user ID.
   * @returns The UserProfile object or null if not found.
   */
  async getProfile(uid: string): Promise<UserProfile | null> {
    return await getDocData<UserProfile>(getPaths.user(uid));
  },

  /**
   * Checks if a username already exists in Firestore.
   * @param username - The username to check.
   * @returns - True if the username exists, false otherwise.
   */
  async checkUsernameExists(username: string): Promise<boolean> {
    if (!username) return false;
    const data = await getDocData<{ uid: string }>(getPaths.username(username));
    return !!data;
  },

  /**
   * Generates a unique username based on display name or email.
   * @param displayName - The user's display name.
   * @param email = - The user's email.
   * @returns A unique username.
   */
  async generateUniqueUsername(
    displayName: string | null,
    email: string | null,
  ): Promise<string> {
    const base = normalizeUsername(displayName || email || "user");
    let username = base;
    let suffix = 0;
    while (await this.checkUsernameExists(username)) {
      suffix++;
      username = `${base}${suffix}`;
    }
    return username;
  },

  /**
   * Automatically initializes the home country for a new user based on location.
   * @param uid - The user ID.
   * @param ipAddress - The user's IP address.
   */
  async initializeUserCountry(uid: string, ipAddress: string): Promise<void> {
    try {
      const geoData = await geoService.getGeoData(ipAddress);

      if (geoData?.countryCode) {
        const userRef = getPaths.user(uid);
        await updateDoc(userRef, { homeCountry: geoData.countryCode });
      }
    } catch (error) {
      console.error("Failed to auto-detect country:", error);
    }
  },

  /**
   * Fetches a user profile by username.
   * @param username - The username.
   * @returns - The UserProfile object or null if not found.
   */
  async getUserProfileByUsername(
    username: string,
  ): Promise<UserProfile | null> {
    if (!username) return null;

    const usernameData = await getDocData<{ uid: string }>(
      getPaths.username(username),
    );
    if (!usernameData) return null;

    return await this.getProfile(usernameData.uid);
  },

  /**
   * Updates user profile fields in Firestore.
   * @param uid - The user's UID
   * @param updates - An object with the fields to update
   */
  async editProfile(uid: string, updates: Partial<UserProfile>) {
    await updateDoc(getPaths.user(uid), updates);

    const profile = await this.getProfile(uid);
    await logUserActivity(
      120,
      {
        updatedFields: Object.keys(updates),
        userName: profile?.displayName,
      },
      uid,
    );
  },

  /**
   * Changes a user's username in Firestore.
   * @param uid - The user's UID.
   * @param oldUsername - The user's current username.
   * @param newUsername - The desired new username.
   * @returns The new username if successful.
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
    const cleanUsername = normalizeUsername(newUsername);

    await runTransaction(db, async (transaction) => {
      const newUsernameRef = doc(db, "usernames", cleanUsername);
      const oldUsernameRef = doc(db, "usernames", oldUsername);
      const userRef = getPaths.user(uid);
      const usernameSnap = await transaction.get(newUsernameRef);

      if (usernameSnap.exists()) {
        throw new Error("USERNAME_TAKEN");
      }

      // Update user document and username references atomically
      transaction.update(userRef, { username: cleanUsername });
      transaction.set(newUsernameRef, { uid });
      transaction.delete(oldUsernameRef);
    });

    return cleanUsername;
  },

  /**
   * Gets home country for a given user ID.
   * @param uid - The user ID.
   * @returns The home country as a string.
   */
  async getHomeCountry(uid: string): Promise<string> {
    return (await this.getProfile(uid))?.homeCountry || "";
  },

  /**
   * Sets the home country for a given user ID.
   * @param uid - The user ID.
   * @param country The country to set as home.
   */
  async setHomeCountry(uid: string, country: string) {
    await updateDoc(getPaths.user(uid), { homeCountry: country });
  },

  /**
   * Updates the user's visitedCountryCodes based on all completed owned and shared trips.
   * @param uid The user ID.
   */
  async updateVisitedCountryCodes(uid: string) {
    const ownedTrips = await getDocsData(getPaths.sub(uid, "trips"));
    const sharedRefs = await getDocsData(getPaths.sub(uid, "sharedTrips"));

    // Fetch shared trips data
    const sharedTrips = await Promise.all(
      sharedRefs.map(
        async (ref) =>
          await getDocData(getPaths.subDoc(ref.ownerUid, "trips", ref.tripId)),
      ),
    );

    // Merge owned and shared trips
    const allTrips = [
      ...ownedTrips,
      ...sharedTrips.filter((t): t is Trip => t !== null),
    ];

    const homeCountry = (await this.getProfile(uid))?.homeCountry;
    const visited = computeVisitedCountriesFromTrips(allTrips, homeCountry);

    // Update the user's profile
    await updateDoc(getPaths.user(uid), { visitedCountryCodes: visited });
  },
};
