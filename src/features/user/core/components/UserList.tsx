import { UserListItem } from "./UserListItem";
import type { UserDisplayProfile } from "../../profile/types";

interface UserListProps {
  profiles?: UserDisplayProfile[];
  uids?: string[];
  getMenuContent?: (profile: UserDisplayProfile) => React.ReactNode;
  getActions?: (uid: string) => React.ReactNode;
}

interface UserListItemData {
  uid: string;
  profile?: UserDisplayProfile;
}

/** Renders a list of users from resolved profiles or UIDs. */
export function UserList({
  profiles = [],
  uids = [],
  getMenuContent,
  getActions,
}: UserListProps) {
  const items: UserListItemData[] =
    profiles.length > 0
      ? profiles.map((profile) => ({ uid: profile.uid, profile }))
      : uids.map((uid) => ({ uid }));

  return (
    <ul className="space-y-2">
      {items.map(({ uid, profile }) => (
        <UserListItem
          key={uid}
          uid={uid}
          profile={profile}
          actions={getActions?.(uid)}
          menuContent={profile ? getMenuContent?.(profile) : undefined}
        />
      ))}
    </ul>
  );
}
