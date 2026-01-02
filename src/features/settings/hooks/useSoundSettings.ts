import { useContext } from "react";
import { SettingsContext } from "@contexts/SettingsContext";
import type { SoundSettings } from "../types";
import { defaultSettings } from "../constants/defaultSettings";

/**
 * Manages sound settings.
 */
export function useSoundSettings(): [
  SoundSettings,
  (settings: Partial<SoundSettings>) => void
] {
  const { settings, updateSettings } = useContext(SettingsContext);
  const sound = settings.sound || defaultSettings.sound;

  // Update only sound settings
  const setSoundSettings = (newSettings: Partial<SoundSettings>) => {
    updateSettings({ sound: { ...sound, ...newSettings } });
  };

  return [sound, setSoundSettings];
}
