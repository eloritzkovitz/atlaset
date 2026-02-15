import { FormField, InputBox } from "@components";
import { getPlatformIcon, platformOrder } from "../config/socialLinks";
import type { SocialPlatform } from "../../types";

interface SocialLinksFieldProps {
  socialLinks: Partial<Record<SocialPlatform, string>>;
  onChange: (platform: SocialPlatform, value: string) => void;
}

export function SocialLinksField({ socialLinks, onChange }: SocialLinksFieldProps) {
  return (
    <FormField label="Social Links">
      <div className="flex flex-col gap-2">
        {platformOrder.map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <span
              className="w-8 flex justify-center items-center"
              title={platform}
              aria-label={platform}
            >
              {getPlatformIcon(platform) ??
                platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
            <InputBox
              id={`social-${platform}`}
              type="url"
              placeholder={`https://${platform}.com/yourprofile`}
              value={socialLinks[platform as SocialPlatform] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(platform as SocialPlatform, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </FormField>
  );
}
