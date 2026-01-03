import { FaPen } from "react-icons/fa6";
import { Card } from "@components";
import { CountryWithFlag, useCountryData } from "@features/countries";
import { formatFirestoreDate } from "@utils/date";
import { ProfileField } from "./ProfileField";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useFriendshipStatus } from "../../friends/hooks/useFriendshipStatus";
import { friendService } from "../../friends/services/friendService";
import { FriendshipButton } from "../../friends/components/FriendshipButton";
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
  const { user: currentUser } = useAuth();
  const selectedCountry = countries.find(
    (c) => c.isoCode === profile.homeCountry
  );

  // Default values for fields
  const displayEmail = profile?.email ?? "No email provided";
  const displayJoinDate =
    formatFirestoreDate(profile?.joinDate) ?? "No date provided";
  const displayBiography = profile?.biography ?? "No biography provided.";

  // Friendship status logic
  const {
    status: friendStatus,
    loading,
    refresh,
  } = useFriendshipStatus(currentUser?.uid, profile.uid);

  // Handle adding friend
  const handleAddFriend = async () => {
    if (!currentUser?.uid) return;
    try {
      await friendService.sendFriendRequest(currentUser.uid, profile.uid);
      await refresh();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  // Handle unfriending
  const handleUnfriend = async () => {
    if (!currentUser?.uid) return;
    try {
      await friendService.removeFriend(currentUser.uid, profile.uid);
      await refresh();
    } catch (error) {
      console.error("Failed to unfriend:", error);
    }
  };

  return (
    <Card>
      {/* Avatar, Name, Username, Edit, Friend Button */}
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
          {/* Friend Button: only show if not me */}
          {!canEdit && currentUser && currentUser.uid !== profile.uid && (
            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
              <FriendshipButton
                friendStatus={friendStatus}
                loading={loading}
                onAddFriend={handleAddFriend}
                onUnfriend={handleUnfriend}
              />
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
