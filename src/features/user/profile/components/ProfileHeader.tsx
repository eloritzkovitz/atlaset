import { useTranslation } from "react-i18next";
import { FaPen, FaListUl } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ActionButton, Card } from "@components";
import { useLanguage } from "@features/settings/account/hooks/useLanguage";
import { UserAvatar } from "./UserAvatar";
import type { UserProfile } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { FriendshipButton } from "../../friends/components/FriendshipButton";
import { useFriendshipStatus } from "../../friends/hooks/useFriendshipStatus";
import { friendService } from "../../friends/services/friendService";

interface ProfileHeaderProps {
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
  const { t } = useTranslation("user");
  const { isRtl } = useLanguage();

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
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 sm:gap-0">
        <UserAvatar user={profile} size={100} className="sm:size-[150px]" />
        <div className="flex-1 sm:ms-6 w-full">
          <div className="flex flex-row items-center w-full gap-3">
            <div className="flex-1 min-w-0">
              <h1
                className={`text-2xl sm:text-3xl font-bold w-full truncate ${
                  isRtl ? "text-right" : "text-left"
                }`}
                dir={isRtl ? "rtl" : undefined}
              >
                {profile.displayName}
              </h1>
            </div>
            {/* Edit Button: only show if canEdit is true */}
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
            {/* Friend Button: only show if not me */}
            {!canEdit && currentUser && currentUser.uid !== profile.uid && (
              <FriendshipButton
                friendStatus={friendStatus}
                loading={loading}
                onAddFriend={handleAddFriend}
                onUnfriend={handleUnfriend}
              />
            )}
          </div>
          <div
            className={`${isRtl ? "text-right" : "text-left"} text-gray-500 text-base mt-1`}
            dir={isRtl ? "rtl" : undefined}
          >
            @{profile.username}
          </div>

          <div className="flex items-center gap-2 mt-1">
            {typeof friendCount === "number" ? (
              <div className="flex items-center gap-2 text-base font-semibold text-muted">
                {/* Total Friends */}
                <button
                  type="button"
                  className="hover:underline focus:outline-none"
                  onClick={onFriendCountClick}
                  disabled={!onFriendCountClick}
                  aria-label={t("profile.header.showFriendsList")}
                >
                  {t("friends.counts.friend", { count: friendCount })}
                </button>

                {/* Mutual Friends */}
                {!canEdit &&
                  typeof mutualFriendCount === "number" &&
                  mutualFriendCount > 0 && (
                    <>
                      <span className="text-muted">•</span>
                      <button
                        type="button"
                        onClick={onMutualCountClick}
                        className="text-sm text-muted/80 hover:underline hover:text-foreground transition-colors"
                      >
                        {t("friends.counts.mutualFriend", {
                          count: mutualFriendCount,
                        })}
                      </button>
                    </>
                  )}
              </div>
            ) : (
              <span className="text-base text-muted">
                {t("friends.status.loading")}
              </span>
            )}
          </div>

          {/* Activity Log Button */}
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
