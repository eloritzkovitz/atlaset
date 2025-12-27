import { doc, getDoc, setDoc } from "firebase/firestore";
import { logUserActivity } from "../../../features/user";
import { appDb } from "@utils/db";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../types";
import { db } from "../../../firebase";

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
      const settingsDoc = doc(db, "users", user!.uid, "settings", "main");
      const snapshot = await getDoc(settingsDoc);
      if (snapshot.exists()) {
        return { id: "main", ...snapshot.data() } as Settings;
      } else {
        return defaultSettings;
      }
    } else {
      const localSettings = await appDb.settings.get("main");
      if (
        localSettings &&
        typeof localSettings === "object" &&
        "id" in localSettings
      ) {
        return localSettings as Settings;
      }
      return defaultSettings;
    }
  },

  /**
   * Saves user settings to Firestore or IndexedDB.
   * @param settings - The settings object to save.
   */
  async save(settings: Settings) {
    const settingsWithId = { ...settings, id: "main" };
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsDoc = doc(db, "users", user!.uid, "settings", "main");
      await setDoc(settingsDoc, settingsWithId);
      await logUserActivity(
        130,
        {
          settings: settingsWithId,
          userName: user!.displayName,
        },
        user!.uid
      );
    } else {
      await appDb.settings.put(settingsWithId);
    }
  },
};
