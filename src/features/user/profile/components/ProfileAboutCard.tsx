import { useState } from "react";
import { Card, TabButton } from "@components";
import { type Country } from "@features/countries";
import { getProfileSections, renderProfileFields } from "./profileSections";
import { SocialLinks } from "./SocialLinks";

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

  return (
    <Card className="mt-6">
      <div className="flex gap-2 mb-4">
        <TabButton
          active={activeTab === "about"}
          onClick={() => setActiveTab("about")}
        >
          About
        </TabButton>
        {displaySocialLinks && (
          <TabButton
            active={activeTab === "social"}
            onClick={() => setActiveTab("social")}
          >
            Social Links
          </TabButton>
        )}
      </div>
      {activeTab === "about" && renderProfileFields(sections)}
      {activeTab === "social" && displaySocialLinks && (
        <SocialLinks links={displaySocialLinks} />
      )}
    </Card>
  );
}
