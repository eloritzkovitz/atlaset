import { UserListItem } from "./UserListItem";
import { friendService } from "../../friends/services/friendService";

interface FriendRequestListProps {
  requests: Array<{ uid: string; from: string }>;
  loading: boolean;
  userUid?: string;
}

export function FriendRequestList({
  requests,
  loading,
  userUid,
}: FriendRequestListProps) {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (requests.length === 0) {
    return (
      <div className="mt-4 text-muted text-sm flex justify-center">
        No friend requests.
      </div>
    );
  }
  return (
    <ul>
      {requests.map((req) => (
        <UserListItem
          key={req.uid}
          uid={req.from}
          onAccept={
            userUid
              ? () => friendService.acceptFriendRequest(userUid, req.from)
              : undefined
          }
          onReject={
            userUid
              ? () => friendService.rejectFriendRequest(userUid, req.from)
              : undefined
          }
        />
      ))}
    </ul>
  );
}
