import { useTranslation } from "react-i18next";
import { FormField, InputBox } from "@components";
import { SocialIcon } from "../social/SocialIcon";
import {
  PLATFORM_ORDER,
  type SocialPlatform,
} from "../../constants/socialPlatforms";

interface SocialLinksFieldProps {
  socialLinks: Partial<Record<SocialPlatform, string>>;
  onChange: (platform: SocialPlatform, value: string) => void;
}

export function SocialLinksField({
  socialLinks,
  onChange,
}: SocialLinksFieldProps) {
  const { t } = useTranslation("user");

  return (
    <FormField label={t("profile.editModal.socialLinks")}>
      <div className="flex flex-col gap-2">
        {PLATFORM_ORDER.map((platform) => (
          <div key={platform} className="flex items-center gap-2">
            <span
              className="w-8 flex justify-center items-center"
              title={platform}
              aria-label={platform}
            >
              <SocialIcon
                platform={platform}
                fallback={platform.charAt(0).toUpperCase() + platform.slice(1)}
              />
            </span>
            <InputBox
              id={`social-${platform}`}
              name={`social-${platform}`}
              type="url"
              placeholder={`https://${platform}.com/yourprofile`}
              value={socialLinks[platform] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(platform, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    </FormField>
  );
}
