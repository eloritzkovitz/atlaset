import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaLink,
  FaXTwitter,
} from "react-icons/fa6";
import { ProfileField } from "./ProfileField";

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
    x: <FaXTwitter className="inline-block" />,
    instagram: <FaInstagram className="inline-block" />,
    facebook: <FaFacebook className="inline-block" />,
    linkedin: <FaLinkedin className="inline-block" />,
    github: <FaGithub className="inline-block" />,
    website: <FaLink className="inline-block" />,
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

/** Renders social links in a profile card. */
export function SocialLinks({ links }: { links: Record<string, string> }) {
  const sortedLinks = Object.entries(links).sort(
    ([a], [b]) => platformOrder.indexOf(a) - platformOrder.indexOf(b),
  );

  return (
    <>
      {sortedLinks.map(([platform, url]) => (
        <ProfileField
          key={platform}
          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mb-1">
              {getPlatformIcon(platform)}
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
              title={platform}
            >
              {getSocialDisplay(url)}
            </a>
          </div>
        </ProfileField>
      ))}
    </>
  );
}
