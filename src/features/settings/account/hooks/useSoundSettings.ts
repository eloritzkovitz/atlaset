import type { SoundSettings } from "../types";
import { defaultSettings } from "../../common/constants/defaultSettings";
import { useSettings } from "../../common/hooks/useSettings";

/**
 * Manages sound settings in the application.
 */
export function useSoundSettings(): [
  SoundSettings,
  (settings: Partial<SoundSettings>) => void,
] {
  const { settings, updateSettings } = useSettings();
  const sound = settings.account.sound || defaultSettings.account.sound;

  /** Updates the sound settings. */
  const setSoundSettings = (newSettings: Partial<SoundSettings>) => {
    updateSettings({
      account: { ...settings.account, sound: { ...sound, ...newSettings } },
    });
  };

  return [sound, setSoundSettings];
}
