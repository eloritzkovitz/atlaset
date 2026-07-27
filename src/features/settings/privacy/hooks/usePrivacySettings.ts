import { useLocalStorageState } from "@hooks";
import type { PrivacySettings } from "../types";
import { defaultSettings } from "../../common/constants/defaultSettings";
import { useSettings } from "../../common/hooks/useSettings";

const GUEST_ANALYTICS_KEY = "atlaset:guest_analytics_consent";

/**
 * Manages privacy settings for both guests and authenticated users.
 */
export function usePrivacySettings(): [
  PrivacySettings,
  (settings: Partial<PrivacySettings>) => void,
] {
  const { settings, updateSettings } = useSettings();

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
