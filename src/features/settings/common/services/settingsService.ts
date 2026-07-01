import { doc, getDoc, setDoc } from "firebase/firestore";
import { appDb } from "@app/db";
import { db } from "@app/firebase";
import { isAuthenticated, getCurrentUser } from "@utils/firebase";
import { defaultSettings } from "../constants/defaultSettings";
import type { Settings } from "../../types";
import { logUserActivity } from "../../../user";

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

      // Create a dedupe key based on the settings data (excluding the id) to avoid duplicate saves
      const newData = { ...settingsWithId } as Record<string, unknown>;
      delete newData.id;
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
      const snapshot = await getDoc(settingsDoc);
      const existingData = snapshot.exists()
        ? (snapshot.data() as Record<string, unknown>)
        : null;
      const samePersisted =
        existingData &&
        JSON.stringify(existingData) === JSON.stringify(newData);
      if (samePersisted) return;

      // Create and store the in-flight promise so concurrent callers coalesce
      const op = (async () => {
        try {
          _lastSaved = { key: dedupeKey, ts: Date.now() };

          await setDoc(settingsDoc, settingsWithId);

          await logUserActivity(
            130,
            {
              settings: settingsWithId,
              userName: user!.displayName,
            },
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
