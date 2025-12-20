import { doc, getDoc, setDoc } from "firebase/firestore";
import { appDb } from "@utils/db";
import {
  isAuthenticated,
  getCurrentUser,
  logUserActivity,
} from "@utils/firebase";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../types";
import { db } from "../../../firebase";

export const settingsService = {
  // Load settings from Firestore or IndexedDB
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
      return (await appDb.settings.get("main")) || defaultSettings;
    }
  },

  // Save or update settings in Firestore or IndexedDB
  async save(settings: Settings) {
    const settingsWithId = { ...settings, id: "main" };
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsDoc = doc(db, "users", user!.uid, "settings", "main");
      await setDoc(settingsDoc, settingsWithId);
      await logUserActivity(
        "edit_settings",
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
