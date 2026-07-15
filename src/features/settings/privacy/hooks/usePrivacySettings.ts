import { useContext } from "react";
import { SettingsContext } from "@contexts/SettingsContext";
import { defaultSettings } from "../../common/constants/defaultSettings";
import type { PrivacySettings } from "../../types";

/**
 * Manages privacy settings for both guests and authenticated users.
 */
export function usePrivacySettings(): [
  PrivacySettings,
  (settings: Partial<PrivacySettings>) => void,
] {
  const { settings, updateSettings } = useContext(SettingsContext);

  // Safely access privacy settings, falling back to defaults if not set
  const privacy = settings.privacy ||
    defaultSettings.privacy || { analyticsConsent: null };

  // Update only privacy settings
  const setPrivacySettings = (newSettings: Partial<PrivacySettings>) => {
    updateSettings({ privacy: { ...privacy, ...newSettings } });
  };

  return [privacy, setPrivacySettings];
}
