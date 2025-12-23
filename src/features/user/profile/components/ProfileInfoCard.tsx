import { FaPen } from "react-icons/fa6";
import { Card } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryWithFlag } from "@features/countries";
import { formatFirestoreDate } from "@utils/date";
import { ProfileField } from "./ProfileField";
import { UserAvatar } from "./UserAvatar";
import type { UserProfile } from "../../types";

interface ProfileInfoCardProps {
  profile: UserProfile;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function ProfileInfoCard({
  profile,
  canEdit,
  onEdit,
}: ProfileInfoCardProps) {
  const { countries } = useCountryData();
  const selectedCountry = countries.find(
    (c) => c.isoCode === profile.homeCountry
  );

  // Default values for fields
  const displayEmail = profile?.email ?? "No email provided";
  const displayJoinDate = formatFirestoreDate(profile?.joinDate) ?? "No date provided";
  const displayBiography = profile?.biography ?? "No biography provided.";

  return (
    <Card>
      {/* Avatar, Name, Username, Edit */}
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 sm:gap-0">
        <UserAvatar user={profile} size={100} className="sm:size-[150px]" />
        <div className="flex-1 sm:ml-6 flex flex-col sm:flex-row items-center w-full">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left w-full">
              {profile.displayName}
            </h1>
            <div className="text-center sm:text-left text-gray-500 text-base mt-1">
              @{profile.username}
            </div>
          </div>
          {canEdit && (
            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
                onClick={onEdit}
              >
                <FaPen className="text-lg" />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <ProfileField label="Email">{displayEmail}</ProfileField>
      <ProfileField label="Country">
        <div className="flex items-center">
          {selectedCountry ? (
            <CountryWithFlag
              isoCode={selectedCountry.isoCode}
              name={selectedCountry.name}
              className="mr-2"
            />
          ) : (
            "Not specified"
          )}
        </div>
      </ProfileField>
      <ProfileField label="Joined">{displayJoinDate}</ProfileField>
      <ProfileField label="Biography">{displayBiography}</ProfileField>
    </Card>
  );
}
