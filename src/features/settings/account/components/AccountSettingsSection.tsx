import { useTranslation } from "react-i18next";
import { AccountManagementSection } from "./AccountManagementSection";
import { ProfileSection } from "./ProfileSection";
import { SoundSettingsSection } from "./SoundSettingsSection";
import { LanguageRegionSection } from "../../localization/components/LanguageRegionSection";

export function AccountSettingsSection() {
  const { t } = useTranslation("settings");
  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("account.title")}
      </h2>
      <ProfileSection />
      <LanguageRegionSection />
      <SoundSettingsSection />
      <AccountManagementSection />
    </div>
  );
}
