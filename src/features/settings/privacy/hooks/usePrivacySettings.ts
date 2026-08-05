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
  (newSettings: Partial<PrivacySettings>) => Promise<void>,
] {
  const { settings, updateSettings } = useSettings();

  const [guestConsent, setGuestConsent] = useLocalStorageState<boolean | null>(
    GUEST_ANALYTICS_KEY,
    null,
  );

  const contextConsent = settings?.privacy?.analyticsConsent;
  const effectiveConsent = contextConsent ?? guestConsent;

  const privacy: PrivacySettings = {
    analyticsConsent: effectiveConsent,
    isPublicProfile:
      settings?.privacy?.isPublicProfile ??
      defaultSettings.privacy?.isPublicProfile ??
      true,
    allowSearchIndexing:
      settings?.privacy?.allowSearchIndexing ??
      defaultSettings.privacy?.allowSearchIndexing ??
      true,
  };

  const setPrivacySettings = async (newSettings: Partial<PrivacySettings>) => {
    if (newSettings.analyticsConsent !== undefined) {
      setGuestConsent(newSettings.analyticsConsent);
    }

    // Determine target public profile state
    const nextIsPublic = newSettings.isPublicProfile ?? privacy.isPublicProfile;

    // Enforce business rule: Public profiles are always discoverable in search
    const nextAllowSearchIndexing = nextIsPublic
      ? true
      : (newSettings.allowSearchIndexing ?? privacy.allowSearchIndexing);

    const updatedPrivacy: PrivacySettings = {
      ...privacy,
      ...newSettings,
      isPublicProfile: nextIsPublic,
      allowSearchIndexing: nextAllowSearchIndexing,
    };

    await updateSettings({ privacy: updatedPrivacy });
  };

  return [privacy, setPrivacySettings];
}
