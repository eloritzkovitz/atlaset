import { getUrlDisplayPath } from "@utils";
import { ProfileField } from "../ProfileField";
import { SocialIcon } from "../../components/social/SocialIcon";
import { PLATFORM_ORDER } from "../../constants/socialPlatforms";

export function SocialLinks({ links }: { links: Record<string, string> }) {
  const sortedLinks = Object.entries(links).sort(
    ([a], [b]) =>
      PLATFORM_ORDER.indexOf(a as (typeof PLATFORM_ORDER)[number]) -
      PLATFORM_ORDER.indexOf(b as (typeof PLATFORM_ORDER)[number]),
  );

  return (
    <>
      {sortedLinks.map(([platform, url]) => (
        <ProfileField
          key={platform}
          label={platform.charAt(0).toUpperCase() + platform.slice(1)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <SocialIcon platform={platform} />
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {getUrlDisplayPath(url)}
            </a>
          </div>
        </ProfileField>
      ))}
    </>
  );
}
