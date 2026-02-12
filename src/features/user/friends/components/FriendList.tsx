import { UserListItem } from "./UserListItem";
import { useFriendSearch } from "../hooks/useFriendSearch";
import type { FriendProfile } from "../../types";

interface FriendListProps {
  profiles: FriendProfile[];
  search: string;
}

export function FriendList({ profiles, search }: FriendListProps) {
  const filtered = useFriendSearch(profiles, search);
  if (profiles.length === 0 && !search) {
    return (
      <div className="mt-4 text-muted text-sm flex justify-center">
        No friends yet.
      </div>
    );
  }
  if (filtered.length === 0) {
    return (
      <div className="mt-4 text-muted text-sm flex justify-center">
        No friends found.
      </div>
    );
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
