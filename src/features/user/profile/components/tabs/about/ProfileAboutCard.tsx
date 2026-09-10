import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCakeCandles,
  FaEnvelope,
  FaHand,
  FaLocationDot,
  FaRegCalendarDays,
} from "react-icons/fa6";
import { Card, TabControl, type TabControlItem } from "@components";
import { CountryWithFlag } from "@features/countries";
import type { Country } from "@features/countries/types";
import { ProfileField } from "../../ProfileField";
import { SocialLinks } from "../../social/SocialLinks";

type ProfileAboutTab = "personal-details" | "contact";

interface ProfileAboutCardProps {
  displayEmail: string | null;
  selectedCountry: Country | null;
  displayBirthday: string;
  displayJoinDate: string;
  displayBiography: string;
  displaySocialLinks: Record<string, string> | null;
}

export function ProfileAboutCard({
  displayEmail,
  selectedCountry,
  displayBirthday,
  displayJoinDate,
  displayBiography,
  displaySocialLinks,
}: ProfileAboutCardProps) {
  const [activeTab, setActiveTab] =
    useState<ProfileAboutTab>("personal-details");
  const { t } = useTranslation("user");

  const notSpecified = t("profile.about.notSpecified");

  // Filter out 'email' from social links since it has its own dedicated field
  const socialLinksWithoutEmail = displaySocialLinks
    ? Object.fromEntries(
        Object.entries(displaySocialLinks).filter(([key]) => key !== "email"),
      )
    : null;

  const tabs: TabControlItem<ProfileAboutTab>[] = [
    {
      value: "personal-details",
      label: t("profile.about.personalDetails.title"),
    },
  ];

  if (displaySocialLinks) {
    tabs.push({
      value: "contact",
      label: t("profile.about.contactInfo.title"),
    });
  }

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold">{t("profile.about.title")}</h2>

      {/* Tab Navigation */}
      <TabControl tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Personal Details Tab */}
      {activeTab === "personal-details" && (
        <div className="flex flex-col">
          <ProfileField label={t("profile.about.personalDetails.location")}>
            <div className="flex items-center gap-3">
              <FaLocationDot />
              {selectedCountry ? (
                <CountryWithFlag country={selectedCountry} />
              ) : (
                <span>{notSpecified}</span>
              )}
            </div>
          </ProfileField>

          <ProfileField label={t("profile.about.personalDetails.birthday")}>
            <div className="flex items-center gap-3">
              <FaCakeCandles />
              <span>{displayBirthday || notSpecified}</span>
            </div>
          </ProfileField>

          <ProfileField label={t("profile.about.personalDetails.joined")}>
            <div className="flex items-center gap-3">
              <FaRegCalendarDays />
              <span>{displayJoinDate || notSpecified}</span>
            </div>
          </ProfileField>

          <ProfileField label={t("profile.about.personalDetails.biography")}>
            <div className="flex items-center gap-3">
              <FaHand />
              <span>{displayBiography || notSpecified}</span>
            </div>
          </ProfileField>
        </div>
      )}

      {/* Contact Info Tab */}
      {activeTab === "contact" && displaySocialLinks && (
        <div className="flex flex-col">
          {displayEmail && (
            <ProfileField label={t("profile.about.contactInfo.email")}>
              <div className="flex items-center gap-3">
                <FaEnvelope />
                <a href={`mailto:${displayEmail}`} className="hover:underline">
                  {displayEmail}
                </a>
              </div>
            </ProfileField>
          )}

          {socialLinksWithoutEmail && (
            <SocialLinks links={socialLinksWithoutEmail} />
          )}
        </div>
      )}
    </Card>
  );
}
