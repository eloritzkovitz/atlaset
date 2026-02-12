import { UserListItem } from "./UserListItem";
import { useFriendSearch } from "../hooks/useFriendSearch";
import type { FriendProfile } from "../../types";
import { EmptyListMessage } from "@components";

interface FriendListProps {
  profiles: FriendProfile[];
  search: string;
}

export function FriendList({ profiles, search }: FriendListProps) {
  const filtered = useFriendSearch(profiles, search);
  if (profiles.length === 0 && !search) {
    return <EmptyListMessage message="No friends yet." />;
  }
  if (filtered.length === 0) {
    return <EmptyListMessage message="No friends found." />;
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
