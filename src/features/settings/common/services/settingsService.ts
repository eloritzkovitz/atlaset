import { writeBatch } from "firebase/firestore";
import { logUserActivity } from "@features/activity/utils/activity";
import type { UserProfile } from "@features/user/profile/types";
import { appDb } from "@lib/db";
import {
  db,
  getCurrentUser,
  getDocData,
  getPaths,
  isAuthenticated,
} from "@lib/firebase";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../../types";

// In-memory dedupe cache to avoid rapid duplicate saves/logs across callers
let _lastSaved: { key?: string; ts?: number } = {};
const _inFlightSaves: Record<string, Promise<void> | undefined> = {};

/** Checks if a save operation is a duplicate within the threshold window. */
function isRecentDuplicate(dedupeKey: string, thresholdMs = 5000): boolean {
  return (
    _lastSaved.key === dedupeKey &&
    !!_lastSaved.ts &&
    Date.now() - _lastSaved.ts < thresholdMs
  );
}

/**
 * Service for managing user settings.
 */
export const settingsService = {
  /**
   * Loads settings for the current user.
   * @returns - The user settings object.
   */
  async load(): Promise<Settings> {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsRef = getPaths.settingsDoc(user!.uid);

      const data = await getDocData<Settings>(settingsRef);
      return data ?? defaultSettings;
    }

    const localSettings = await appDb.settings.get("main");
    return localSettings &&
      typeof localSettings === "object" &&
      "id" in localSettings
      ? (localSettings as Settings)
      : defaultSettings;
  },

  /**
   * Saves user settings to Firestore or IndexedDB.
   * @param settings - The settings object to save.
   */
  async save(settings: Settings): Promise<void> {
    const settingsWithId = { ...settings, id: "main" };

    if (!isAuthenticated()) {
      const existing = await appDb.settings.get("main");
      if (
        existing &&
        JSON.stringify(existing) === JSON.stringify(settingsWithId)
      ) {
        return;
      }
      await appDb.settings.put(settingsWithId);
      return;
    }

    const user = getCurrentUser();
    const dedupeKey = JSON.stringify(settings);

    if (_inFlightSaves[dedupeKey]) {
      await _inFlightSaves[dedupeKey];
      return;
    }

    if (isRecentDuplicate(dedupeKey)) {
      return;
    }

    // Create and store the in-flight promise so concurrent callers coalesce
    const op = (async () => {
      try {
        _lastSaved = { key: dedupeKey, ts: Date.now() };

        const batch = writeBatch(db);
        const settingsRef = getPaths.settingsDoc(user!.uid);

        batch.set(settingsRef, settingsWithId, { merge: true });

        // Update user profile privacy fields if they exist in the settings
        if (settings.privacy) {
          const userRef = getPaths.user(user!.uid);
          const userUpdates: Partial<UserProfile> = {};

          if (settings.privacy.isPublicProfile !== undefined) {
            userUpdates.isPublic = settings.privacy.isPublicProfile;
          }
          if (settings.privacy.allowSearchIndexing !== undefined) {
            userUpdates.isSearchIndexingAllowed =
              settings.privacy.allowSearchIndexing;
          }

          if (Object.keys(userUpdates).length > 0) {
            batch.update(userRef, userUpdates);
          }
        }

        await batch.commit();

        await logUserActivity(
          130,
          { settings: settingsWithId, userName: user!.displayName },
          user!.uid,
        );
      } finally {
        delete _inFlightSaves[dedupeKey];
      }
    })();

    _inFlightSaves[dedupeKey] = op;
    await op;
  },
};
