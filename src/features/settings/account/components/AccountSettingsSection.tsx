import { useTranslation } from "react-i18next";
import { HomeCountrySelect } from "./HomeCountrySelect";
import { ProfileSection } from "./ProfileSection";
import { AccountManagementSection } from "./AccountManagementSection";
import { LanguageSelect } from "./LanguageSelect";

export function AccountSettingsSection() {
  const { t } = useTranslation("settings");
  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("account.title")}
      </h2>
      <ProfileSection />
      <HomeCountrySelect />
      <LanguageSelect />
      <AccountManagementSection />
    </div>
  );
}
