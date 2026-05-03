import { doc, getDoc, setDoc } from "firebase/firestore";
import { appDb } from "@app/db";
import { db } from "@app/firebase";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../types";
import { logUserActivity } from "../../../features/user";

// In-memory dedupe cache to avoid rapid duplicate saves/logs across callers
let _lastSaved: { key?: string; ts?: number } = {};

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

      // Prepare payload shape for comparison (exclude id)
      const newData = { ...settingsWithId } as Record<string, unknown>;
      delete newData.id;

      // Check persisted snapshot first to avoid unnecessary writes and activity logs
      const snapshot = await getDoc(settingsDoc);
      const existingData = snapshot.exists()
        ? (snapshot.data() as Record<string, unknown>)
        : null;
      const samePersisted =
        existingData &&
        JSON.stringify(existingData) === JSON.stringify(newData);
      if (samePersisted) return;

      // Dedupe recent identical save attempts that may race before backend reflects the write
      const dedupeKey = JSON.stringify(newData);
      if (
        _lastSaved.key === dedupeKey &&
        _lastSaved.ts &&
        Date.now() - _lastSaved.ts < 5000
      ) {
        return;
      }

      await setDoc(settingsDoc, settingsWithId);

      // update cache to avoid immediate duplicate writes from other callers
      _lastSaved = { key: dedupeKey, ts: Date.now() };

      await logUserActivity(
        130,
        {
          settings: settingsWithId,
          userName: user!.displayName,
        },
        user!.uid,
      );
    } else {
      const existing = await appDb.settings.get("main");
      if (
        existing &&
        JSON.stringify(existing) === JSON.stringify(settingsWithId)
      )
        return;
      await appDb.settings.put(settingsWithId);
    }
  },
};
