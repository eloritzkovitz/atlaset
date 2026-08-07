/** The order of social platforms. */
export const PLATFORM_ORDER = [
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "github",
  "website",
] as const;

/** Represents a social media platform. */
export type SocialPlatform = (typeof PLATFORM_ORDER)[number];
