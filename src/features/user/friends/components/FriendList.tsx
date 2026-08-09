import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { UserListItem } from "./UserListItem";
import { useFriendSearch } from "../hooks/useFriendSearch";
import type { FriendProfile } from "../types";

interface FriendListProps {
  profiles: FriendProfile[];
  search: string;
  isMutualOnly?: boolean;
}

export function FriendList({
  profiles,
  search,
  isMutualOnly = false,
}: FriendListProps) {
  const { t } = useTranslation("user");
  const filtered = useFriendSearch(profiles, search);

  if (profiles.length === 0 && !search) {
    const emptyMessage = isMutualOnly
      ? t("friends.empty.noMutualFriends")
      : t("friends.empty.noFriendsYet");

    return <EmptyListMessage message={emptyMessage} />;
  }

  if (filtered.length === 0) {
    return <EmptyListMessage message={t("friends.empty.noFriendsFound")} />;
  }

  return (
    <ul className="space-y-2">
      {filtered.map((profile) => (
        <li key={profile.uid}>
          <UserListItem uid={profile.uid} />
        </li>
      ))}
    </ul>
  );
}
