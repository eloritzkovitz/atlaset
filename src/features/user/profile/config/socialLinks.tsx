import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaXTwitter,
} from "react-icons/fa6";

// Order of platforms for display
export const platformOrder = [
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "github",
  "website",
];

/** Returns the appropriate icon for a given platform. */
export const getPlatformIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    x: <FaXTwitter />,
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    linkedin: <FaLinkedin />,
    github: <FaGithub />,
    website: <FaLink />,
  };
  return icons[platform.toLowerCase()] ?? null;
};

/** Extracts a display name from a social link URL. */
export function getSocialDisplay(url: string) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1];
    }
    return url;
  } catch {
    return url;
  }
}
