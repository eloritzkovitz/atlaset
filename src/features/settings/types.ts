import type { MapSettings } from "@features/atlas/settings/types";
import type { AccountSettings } from "./account/types";
import type { DisplaySettings } from "./display/types";
import type { PrivacySettings } from "./privacy/types";

/** Accessibility-related settings. */
export type AccessibilitySettings = {
  singleKeyShortcutsEnabled: boolean;
  animationsEnabled: boolean;
};

/** Represents the overall settings object. */
export type Settings = {
  id: string;
  account: AccountSettings;
  display: DisplaySettings;
  accessibility: AccessibilitySettings;
  privacy: PrivacySettings;
  map: MapSettings;
};
