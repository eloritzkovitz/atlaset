import { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { Card, TabButton } from "@components";
import { type Country } from "@features/countries";
import { ProfileField } from "./ProfileField";
import { SocialLinks } from "./SocialLinks";
import {
  getProfileSections,
  renderProfileFields,
} from "../config/profileSections";

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
  const [activeTab, setActiveTab] = useState<"personal-details" | "contact">(
    "personal-details",
  );

  // Generate profile sections based on provided data
  const sections = getProfileSections({
    selectedCountry,
    displayBirthday,
    displayJoinDate,
    displayBiography,
  });

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold">About</h2>
      <div className="flex gap-2">
        <TabButton
          active={activeTab === "personal-details"}
          onClick={() => setActiveTab("personal-details")}
        >
          Personal Details
        </TabButton>
        {displaySocialLinks && (
          <TabButton
            active={activeTab === "contact"}
            onClick={() => setActiveTab("contact")}
          >
            Contact Info
          </TabButton>
        )}
      </div>
      {activeTab === "personal-details" && renderProfileFields(sections)}
      {activeTab === "contact" && displaySocialLinks && (
        <div className="flex flex-col">
          {displayEmail && (
            <ProfileField label="Email">
              <div className="flex items-center gap-3">
                <FaEnvelope />
                <a href={`mailto:${displayEmail}`}>{displayEmail}</a>
              </div>
            </ProfileField>
          )}
          <SocialLinks
            links={Object.fromEntries(
              Object.entries(displaySocialLinks).filter(([k]) => k !== "email"),
            )}
          />
        </div>
      )}
    </Card>
  );
}
