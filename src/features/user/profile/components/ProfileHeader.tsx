import { useTranslation } from "react-i18next";
import { FaPen, FaListUl } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ActionButton, Card } from "@components";
import { useScreenSize } from "@hooks";
import { FriendStats } from "./FriendStats";
import type { UserProfile } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { UserAvatar } from "../../core/components/UserAvatar";
import { FriendshipButton } from "../../friends/components/FriendshipButton";
import { useFriendshipStatus } from "../../friends/hooks/useFriendshipStatus";
import { friendService } from "../../friends/services/friendService";

export interface ProfileHeaderProps {
  profile: UserProfile;
  canEdit?: boolean;
  onEdit?: () => void;
  friendCount?: number;
  mutualFriendCount?: number;
  onFriendCountClick?: () => void;
  onMutualCountClick?: () => void;
}

export function ProfileHeader({
  profile,
  canEdit,
  onEdit,
  friendCount,
  mutualFriendCount,
  onFriendCountClick,
  onMutualCountClick,
}: ProfileHeaderProps) {
  const { user: currentUser } = useAuth();
  const { isMobile } = useScreenSize();
  const { t } = useTranslation("user");
  const {
    status: friendStatus,
    loading,
    refresh,
  } = useFriendshipStatus(currentUser?.uid, profile.uid);

  const handleAddFriend = async () => {
    if (!currentUser?.uid) return;
    try {
      await friendService.sendFriendRequest(currentUser.uid, profile.uid);
      await refresh();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const handleUnfriend = async () => {
    if (!currentUser?.uid) return;
    try {
      await friendService.removeFriend(currentUser.uid, profile.uid);
      await refresh();
    } catch (error) {
      console.error("Failed to unfriend:", error);
    }
  };

  if (isMobile) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center gap-4">
          <UserAvatar user={profile} size={80} />

          <div className="w-full min-w-0 text-center">
            <h2 className="truncate text-2xl font-bold">
              {profile.displayName}
            </h2>
            <div className="mt-1 truncate text-base text-gray-500">
              @{profile.username}
            </div>
            <div className="mt-3 flex min-h-6 items-center justify-center gap-2">
              <FriendStats
                canEdit={canEdit}
                friendCount={friendCount}
                mutualFriendCount={mutualFriendCount}
                onFriendCountClick={onFriendCountClick}
                onMutualCountClick={onMutualCountClick}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {canEdit && (
              <ActionButton
                variant="primary"
                className="!w-full !rounded-xl"
                onClick={onEdit}
                icon={<FaPen className="text-lg" />}
              >
                {t("profile.header.editProfile")}
              </ActionButton>
            )}

            {!canEdit && currentUser && currentUser.uid !== profile.uid && (
              <FriendshipButton
                friendStatus={friendStatus}
                loading={loading}
                onAddFriend={handleAddFriend}
                onUnfriend={handleUnfriend}
              />
            )}

            {canEdit && (
              <Link to="/activity" className="w-full">
                <ActionButton
                  variant="secondary"
                  className="!w-full !rounded-xl"
                  icon={<FaListUl className="text-lg" />}
                >
                  {t("profile.header.activityLog")}
                </ActionButton>
              </Link>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 sm:gap-0">
        <UserAvatar user={profile} size={100} className="sm:size-[150px]" />
        <div className="flex-1 sm:ms-6 w-full">
          <div className="flex flex-row items-center w-full gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold w-full truncate text-start">
                {profile.displayName}
              </h1>
            </div>
            {canEdit && (
              <ActionButton
                variant="primary"
                className="!rounded-full mt-4"
                onClick={onEdit}
                icon={<FaPen className="text-lg" />}
              >
                {t("profile.header.editProfile")}
              </ActionButton>
            )}
            {!canEdit && currentUser && currentUser.uid !== profile.uid && (
              <FriendshipButton
                friendStatus={friendStatus}
                loading={loading}
                onAddFriend={handleAddFriend}
                onUnfriend={handleUnfriend}
              />
            )}
          </div>
          <div className="text-start text-gray-500 text-base mt-1">
            @{profile.username}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <FriendStats
              canEdit={canEdit}
              friendCount={friendCount}
              mutualFriendCount={mutualFriendCount}
              onFriendCountClick={onFriendCountClick}
              onMutualCountClick={onMutualCountClick}
            />
          </div>

          {canEdit && (
            <div className="flex flex-col items-end -mt-12">
              <Link to="/activity">
                <ActionButton
                  variant="secondary"
                  className="!rounded-full"
                  icon={<FaListUl className="text-lg" />}
                >
                  {t("profile.header.activityLog")}
                </ActionButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
