import { setDoc } from "firebase/firestore";
import { appDb } from "@app/db";
import { logUserActivity } from "@features/activity/utils/activity";
import {
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
  async save(settings: Settings) {
    const settingsWithId = { ...settings, id: "main" };
    if (isAuthenticated()) {
      const user = getCurrentUser();
      const settingsRef = getPaths.settingsDoc(user!.uid);

      // Create a dedupe key based on the settings data (excluding the id) to avoid duplicate saves
      const newData = { ...settings };
      const dedupeKey = JSON.stringify(newData);

      // If an identical save is already in-flight, wait for it to complete instead
      if (_inFlightSaves[dedupeKey]) {
        await _inFlightSaves[dedupeKey];
        return;
      }

      // If the last save was identical and recent, skip this save to avoid rapid duplicates
      if (
        _lastSaved.key === dedupeKey &&
        _lastSaved.ts &&
        Date.now() - _lastSaved.ts < 5000
      ) {
        return;
      }

      // Check persisted snapshot second to prevent redundant writes
      const existingData = await getDocData<Settings>(settingsRef);
      if (
        existingData &&
        JSON.stringify(existingData) === JSON.stringify(settingsWithId)
      )
        return;

      // Create and store the in-flight promise so concurrent callers coalesce
      const op = (async () => {
        try {
          _lastSaved = { key: dedupeKey, ts: Date.now() };
          await setDoc(settingsRef, settingsWithId);
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
