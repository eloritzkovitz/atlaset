import React from "react";
import {
  FaCakeCandles,
  FaCalendar,
  FaEnvelope,
  FaHouse,
  FaHand,
  FaLink,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";
import { CountryWithFlag } from "@features/countries";
import { ProfileField } from "./ProfileField";

export type ProfileSection = {
  key: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

/** Returns the appropriate icon for a given platform. */
export const getPlatformIcon = (platform: string) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: <FaTwitter className="inline-block" />,
    instagram: <FaInstagram className="inline-block" />,
    facebook: <FaFacebook className="inline-block" />,
    linkedin: <FaLinkedin className="inline-block" />,
    github: <FaGithub className="inline-block" />,
    website: <FaLink className="inline-block" />,
  };
  return icons[platform.toLowerCase()] ?? null;
};

/** Generates profile sections based on user profile data. */
export function renderProfileFields(
  fields: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>,
) {
  return fields.map(({ key, label, icon, content }) => (
    <ProfileField key={key} label={label}>
      <div className="flex items-center gap-3">
        {icon}
        {content}
      </div>
    </ProfileField>
  ));
}

/** Generates profile sections based on user profile data. */
export function getProfileSections({
  displayEmail,
  selectedCountry,
  displayBirthday,
  displayJoinDate,
  displayBiography,
}: {
  displayEmail: string;
  selectedCountry: any;
  displayBirthday: string;
  displayJoinDate: string;
  displayBiography: string;
}): ProfileSection[] {
  return [
    {
      key: "email",
      label: "Email",
      icon: <FaEnvelope />,
      content: displayEmail,
    },
    {
      key: "country",
      label: "Country",
      icon: <FaHouse />,
      content: selectedCountry ? (
        <CountryWithFlag
          isoCode={selectedCountry.isoCode}
          name={selectedCountry.name}
          className="mr-2"
        />
      ) : (
        "Not specified"
      ),
    },
    {
      key: "birthday",
      label: "Birthday",
      icon: <FaCakeCandles />,
      content: displayBirthday,
    },
    {
      key: "joined",
      label: "Joined",
      icon: <FaCalendar />,
      content: displayJoinDate,
    },
    {
      key: "biography",
      label: "Biography",
      icon: <FaHand />,
      content: displayBiography,
    },
  ];
}
