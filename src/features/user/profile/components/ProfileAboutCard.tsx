import { useState } from "react";
import { Card, TabButton } from "@components";
import { type Country } from "@features/countries";
import {
  getPlatformIcon,
  getProfileSections,
  renderProfileFields,
} from "./profileSections";

interface ProfileAboutCardProps {
  displayEmail: string;
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
  const [activeTab, setActiveTab] = useState<"about" | "social">("about");

  // Generate profile sections based on provided data
  const sections = getProfileSections({
    displayEmail,
    selectedCountry,
    displayBirthday,
    displayJoinDate,
    displayBiography,
  });

  // Prepare social link fields for ProfileField rendering only if present
  const socialLinksArray = displaySocialLinks
    ? Object.entries(displaySocialLinks).map(([platform, url]) => ({
        key: platform,
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
        icon: (
          <div className="flex items-center gap-2 mb-1">
            {getPlatformIcon(platform)}
          </div>
        ),
        content: (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
            title={platform}
          >
            {url}
          </a>
        ),
      }))
    : null;

  return (
    <Card className="mt-6">
      <div className="flex gap-2 mb-4">
        <TabButton
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          About
        </TabButton>
        {socialLinksArray && (
          <TabButton
            active={activeTab === "social"}
            onClick={() => setActiveTab("social")}
          >
            Social Links
          </TabButton>
        )}
      </div>
      {activeTab === "about" && renderProfileFields(sections)}
      {activeTab === "social" &&
        socialLinksArray &&
        renderProfileFields(socialLinksArray)}
    </Card>
  );
}
