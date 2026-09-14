import { Link } from "react-router-dom";
import { PanelListItem } from "@components";
import { UserInfo } from "./UserInfo";
import { useUserProfile } from "../../profile/hooks/useUserProfile";
import type { UserDisplayProfile } from "../../profile/types";

interface UserListItemProps {
  uid?: string;
  profile?: UserDisplayProfile;
  profileLink?: boolean;
  actions?: React.ReactNode;
  menuContent?: React.ReactNode;
  loading?: boolean;
}

export function UserListItem({
  uid,
  profile,
  profileLink = true,
  actions,
  menuContent,
  loading: externalLoading,
}: UserListItemProps) {
  const shouldFetchProfile = !profile && !!uid;
  const { profile: fetchedProfile, loading: profileLoading } = useUserProfile({
    uid: shouldFetchProfile ? uid : undefined,
  });
  const userProfile = profile ?? fetchedProfile;

  const loading = externalLoading ?? (!profile && profileLoading);

  // Determine display name or fallback to username or uid
  const resolvedDisplayName =
    userProfile?.displayName || userProfile?.username || uid || "user";

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
      <span className="font-semibold">{resolvedDisplayName}</span>
      {userProfile?.username && (
        <span className="text-xs text-muted">@{userProfile.username}</span>
      )}
    </div>
  );

  // Content for the list item, wrapped in a link if profileLink is true
  const content = (
    <div className="flex items-center gap-3 flex-1 min-w-0">{nameContent}</div>
  );

  return (
    <PanelListItem
      color="transparent"
      variant="border"
      icon={icon}
      name={
        profileLink ? (
          <Link
            to={`/users/${userProfile?.username || uid}`}
            className="flex items-center gap-3 flex-1 min-w-0 hover:underline focus:outline-none"
            tabIndex={0}
          >
            {content}
          </Link>
        ) : (
          content
        )
      }
      visible
      menuContent={menuContent}
      menuPosition="left"
    >
      {actions}
    </PanelListItem>
  );
}
