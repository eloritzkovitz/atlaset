/** Visibility options for profile sections. */
export type ProfileVisibility = "public" | "friends" | "private";

/** Privacy-related settings. */
export type PrivacySettings = {
  /** Consent for analytics and telemetry tracking. */
  analyticsConsent: boolean | null;
  /** Indicates if the profile is public. */
  isPublicProfile: boolean;
  /** Indicates if search indexing is allowed. */
  allowSearchIndexing: boolean;
};
