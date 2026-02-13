import React from "react";
import {
  FaCakeCandles,
  FaCalendar,
  FaHand,
  FaLocationDot,
} from "react-icons/fa6";
import { CountryWithFlag } from "@features/countries";
import { ProfileField } from "../components/ProfileField";

export type ProfileSection = {
  key: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
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
  selectedCountry,
  displayBirthday,
  displayJoinDate,
  displayBiography,
}: {
  selectedCountry: {
    isoCode: string;
    name: string;
    className?: string;
  } | null;
  displayBirthday: string;
  displayJoinDate: string;
  displayBiography: string;
}): ProfileSection[] {
  return [
    {
      key: "location",
      label: "Location",
      icon: <FaLocationDot />,
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
