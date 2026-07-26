import { useContext } from "react";
import { SettingsContext } from "@contexts/SettingsContext";
import type { SoundSettings } from "../types";
import { defaultSettings } from "../../common/constants/defaultSettings";

/**
 * Manages sound settings.
 */
export function useSoundSettings(): [
  SoundSettings,
  (settings: Partial<SoundSettings>) => void,
] {
  const { settings, updateSettings } = useContext(SettingsContext);
  const sound = settings.account.sound || defaultSettings.account.sound;

  // Update only sound settings
  const setSoundSettings = (newSettings: Partial<SoundSettings>) => {
    updateSettings({
      account: { ...settings.account, sound: { ...sound, ...newSettings } },
    });
  };

  return [sound, setSoundSettings];
}
