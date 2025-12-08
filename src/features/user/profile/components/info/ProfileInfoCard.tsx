import { FaPen } from "react-icons/fa6";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountryWithFlag } from "@features/countries";
import { useHomeCountry } from "@features/settings";
import { useVisitedCountries } from "@features/visits";
import { UserAvatar } from "@layout/UserAvatar/UserAvatar";
import { ProfileField } from "./ProfileField";

interface ProfileInfoCardProps {
  user: any;
  email?: string;
  joinDate?: string | null;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function ProfileInfoCard({
  user,
  email,
  joinDate,
  canEdit,
  onEdit,
}: ProfileInfoCardProps) {
  const { countries } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { visitedCountryCodes } = useVisitedCountries();
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <>
      {/* Avatar, Name, Edit */}
      <div className="flex items-center mb-6">
        <UserAvatar user={user} size={150} />
        <div className="flex-1 ml-6 flex items-center">
          <h1 className="text-3xl font-bold">{user?.displayName}</h1>
        </div>
        {canEdit && (
          <div className="flex-shrink-0 ml-auto">
            <button
              className="px-4 py-2 flex items-center gap-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition"
              onClick={onEdit}
            >
              <FaPen className="text-lg" />
              Edit Profile
            </button>
          </div>
        )}
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
      <ProfileField label="Visited Countries">
        {visitedCountryCodes.length}
      </ProfileField>
      <ProfileField label="Joined">{joinDate}</ProfileField>
    </>
  );
}
