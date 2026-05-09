import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { UserListItem } from "./UserListItem";
import { useFriendSearch } from "../hooks/useFriendSearch";
import type { FriendProfile } from "../../types";

interface FriendListProps {
  profiles: FriendProfile[];
  search: string;
}

export function FriendList({ profiles, search }: FriendListProps) {
  const { t } = useTranslation("user");
  const filtered = useFriendSearch(profiles, search);

  if (profiles.length === 0 && !search) {
    return <EmptyListMessage message={t("friends.noFriendsYet")} />;
  }

  if (filtered.length === 0) {
    return <EmptyListMessage message={t("friends.noFriendsFound")} />;
  }

  return (
    <ul>
      {filtered.map((profile) => (
        <div className="mb-2" key={profile.uid}>
          <UserListItem uid={profile.uid} />
        </div>
      ))}
    </ul>
  );
}
