import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { usePrivacySettings } from "../hooks/usePrivacySettings";
import { SettingsCard } from "../../common/components/SettingsCard";
import { SettingsToggle } from "../../common/components/SettingsToggle";

export function PrivacySettingsSection() {
  const [privacy, setPrivacySettings] = usePrivacySettings();
  const { t } = useTranslation("settings");

  // Handle analytics consent toggle
  const handleAnalyticsConsentChange = (checked: boolean) => {
    setPrivacySettings({ analyticsConsent: checked });
  };

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 self-start">
        {t("privacy.title")}
      </h2>
      <SettingsCard title={t("privacy.analytics.title")} icon={<ICONS.analytics />}>
        <div className="flex flex-col gap-6">
          <SettingsToggle
            label={t("privacy.analytics.consent")}
            description={t("privacy.analytics.description")}
            checked={!!privacy.analyticsConsent}
            onChange={handleAnalyticsConsentChange}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
