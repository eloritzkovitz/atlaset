import { ProfileField } from "./ProfileField";
import {
  platformOrder,
  getPlatformIcon,
  getSocialDisplay,
} from "../config/socialLinks";

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
