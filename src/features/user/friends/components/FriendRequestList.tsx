import { UserListItem } from "./UserListItem";
import { friendService } from "../../friends/services/friendService";
import { EmptyListMessage } from "@components";

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
    return <EmptyListMessage message="No friend requests." />;
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
