import { Link } from "react-router-dom";
import { ActionButton, PanelListItem } from "@components";
import { ICONS } from "@constants/icons";
import { FriendListItemMenuActions } from "./FriendListItemMenuActions";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import { UserInfo } from "../../profile/components/UserInfo";

interface UserListItemProps {
  uid: string;
  profileLink?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  loading?: boolean;
}

export function UserListItem({
  uid,
  profileLink = true,
  onAccept,
  onReject,
  loading: externalLoading,
}: UserListItemProps) {
  const { profile: userProfile, loading: profileLoading } = useUserProfile({
    uid,
  });
  const loading = externalLoading ?? profileLoading;

  // Custom icon/content for PanelListItem
  const icon = loading ? (
    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  ) : (
    <UserInfo
      user={userProfile}
      avatarSize={32}
      showDisplayName={false}
      showUsername={false}
    />
  );

  // Name content with display name and username, or skeleton if loading
  const nameContent = loading ? (
    <span className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
  ) : (
    <div className="flex flex-col">
      <span className="font-semibold">
        {userProfile?.displayName || userProfile?.username || uid}
      </span>
      {userProfile?.username && (
        <span className="text-xs text-muted">@{userProfile.username}</span>
      )}
    </div>
  );

  // Accept/reject actions
  const actions = (onAccept || onReject) && (
    <div className="flex gap-1 ms-2">
      {onAccept && (
        <ActionButton
          onClick={onAccept}
          title="Accept"
          ariaLabel="Accept friend request"
          icon={<ICONS.selected />}
          className="text-success"
          rounded
        />
      )}
      {onReject && (
        <ActionButton
          onClick={onReject}
          title="Reject"
          ariaLabel="Reject friend request"
          icon={<ICONS.close />}
          className="text-danger"
          rounded
        />
      )}
    </div>
  );

  return (
    <PanelListItem
      color={"transparent"}
      icon={icon}
      name={
        profileLink ? (
          <Link
            to={`/users/${userProfile?.username || uid}`}
            className="flex items-center gap-3 flex-1 min-w-0 hover:underline focus:outline-none"
            tabIndex={0}
          >
            {nameContent}
          </Link>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {nameContent}
          </div>
        )
      }
      visible={true}
      menuContent={
        !onAccept && !onReject ? (
          <FriendListItemMenuActions
            uid={uid}
            username={userProfile?.username}
          />
        ) : undefined
      }
      menuPosition="left"
    >
      {actions}
    </PanelListItem>
  );
}
