import type { User } from "firebase/auth";
import { FaPen } from "react-icons/fa6";
import { Card } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryWithFlag } from "@features/countries";
import { ProfileField } from "./ProfileField";
import { UserAvatar } from "./UserAvatar";

interface ProfileInfoCardProps {
  user: User | null;
  username: string;
  email?: string;
  joinDate?: string | null;
  canEdit?: boolean;
  onEdit?: () => void;
  homeCountry?: string;
}

export function ProfileInfoCard({
  user,
  username,
  email,
  joinDate,
  canEdit,
  onEdit,
  homeCountry,
}: ProfileInfoCardProps) {
  const { countries } = useCountryData();
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <Card>
      {/* Avatar, Name, Username, Edit */}
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 sm:gap-0">
        <UserAvatar user={user} size={100} className="sm:size-[150px]" />
        <div className="flex-1 sm:ml-6 flex flex-col sm:flex-row items-center w-full">
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left w-full">
              {user?.displayName}
            </h1>
            {username && (
              <div className="text-center sm:text-left text-gray-500 text-base mt-1">
                @{username}
              </div>
            )}
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
      <ProfileField label="Email">{email}</ProfileField>
      {homeCountry && (
        <ProfileField label="Country">
          <div className="flex items-center">
            <CountryWithFlag
              isoCode={selectedCountry?.isoCode || ""}
              name={selectedCountry?.name || ""}
              className="mr-2"
            />
          </div>
        </ProfileField>
      )}
      <ProfileField label="Joined">{joinDate}</ProfileField>
    </Card>
  );
}
