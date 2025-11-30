import { doc, getDoc, setDoc } from "firebase/firestore";
import { defaultSettings } from "@constants/defaultSettings";
import type { Settings } from "@types";
import { appDb } from "@utils/db";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import { db } from "../../firebase";

export const settingsService = {
  // Load settings from Firestore or IndexedDB
  async load(): Promise<Settings> {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsDoc = doc(db, "users", user!.uid, "settings", "main");
      const snapshot = await getDoc(settingsDoc);
      return snapshot.exists()
        ? (snapshot.data() as Settings)
        : defaultSettings;
    } else {
      return (await appDb.settings.get("main")) || defaultSettings;
    }
  },

  // Save or update settings in Firestore or IndexedDB
  async save(settings: Settings) {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsDoc = doc(db, "users", user!.uid, "settings", "main");
      await setDoc(settingsDoc, settings);
    } else {
      await appDb.settings.put(settings);
    }
  },
};
