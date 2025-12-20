import { HomeCountrySelect } from "./HomeCountrySelect";
import { ProfileSection } from "./ProfileSection";
import { AccountManagementSection } from "./AccountManagementSection";

export function AccountSettingsSection() {
  return (
    <div className="mx-auto max-w-lg w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">Account Settings</h2>
      <ProfileSection />
      <HomeCountrySelect />
      <AccountManagementSection />
    </div>
  );
}
