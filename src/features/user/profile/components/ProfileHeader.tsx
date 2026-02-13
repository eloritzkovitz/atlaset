import { FaPen } from "react-icons/fa6";
import { ActionButton, Card } from "@components";
import { UserAvatar } from "./UserAvatar";
import { useAuth } from "../../auth/hooks/useAuth";
import { useFriendshipStatus } from "../../friends/hooks/useFriendshipStatus";
import { friendService } from "../../friends/services/friendService";
import { FriendshipButton } from "../../friends/components/FriendshipButton";
import type { UserProfile } from "../../types";

interface ProfileHeaderProps {
  profile: UserProfile;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({
  profile,
  canEdit,
  onEdit,
}: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();

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
          {/* Edit Button: only show if canEdit is true */}
          {canEdit && (
            <div className="flex-shrink-0">
              <ActionButton
                variant="primary"
                className="!rounded-full"
                onClick={onEdit}
                icon={<FaPen className="text-lg" />}
              >
                Edit Profile
              </ActionButton>
            </div>
          )}
          {/* Friend Button: only show if not me */}
          {!canEdit && currentUser && currentUser.uid !== profile.uid && (
            <div className="flex-shrink-0">
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
    </Card>
  );
}
