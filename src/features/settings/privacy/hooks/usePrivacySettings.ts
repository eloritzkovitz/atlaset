import { useContext } from "react";
import { SettingsContext } from "@contexts/SettingsContext";
import { useLocalStorageState } from "@hooks";
import { defaultSettings } from "../../common/constants/defaultSettings";
import type { PrivacySettings } from "../types";

const GUEST_ANALYTICS_KEY = "atlaset:guest_analytics_consent";

/**
 * Manages privacy settings for both guests and authenticated users.
 */
export function usePrivacySettings(): [
  PrivacySettings,
  (settings: Partial<PrivacySettings>) => void,
] {
  const { settings, updateSettings } = useContext(SettingsContext);

  const [guestConsent, setGuestConsent] = useLocalStorageState<boolean | null>(
    GUEST_ANALYTICS_KEY,
    null,
  );

  // Determine the effective analytics consent based on user settings and guest consent
  const contextConsent = settings?.privacy?.analyticsConsent;
  const effectiveConsent = contextConsent ?? guestConsent;

  const privacy: PrivacySettings = {
    ...(settings.privacy || defaultSettings.privacy || {}),
    analyticsConsent: effectiveConsent,
  };

  const setPrivacySettings = (newSettings: Partial<PrivacySettings>) => {
    if (newSettings.analyticsConsent !== undefined) {
      setGuestConsent(newSettings.analyticsConsent);
    }

    updateSettings({ privacy: { ...privacy, ...newSettings } });
  };

  return [privacy, setPrivacySettings];
}
