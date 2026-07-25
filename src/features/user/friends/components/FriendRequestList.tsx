import { UserListItem } from "./UserListItem";
import { friendService } from "../../friends/services/friendService";
import { EmptyListMessage } from "@components";
import { useTranslation } from "react-i18next";

interface FriendRequestListProps {
  requests: Array<{ uid: string; from: string }>;
  loading: boolean;
  userUid?: string;
  currentUserName?: string;
}

export function FriendRequestList({
  requests,
  loading,
  userUid,
  currentUserName,
}: FriendRequestListProps) {
  const { t } = useTranslation("user");

  if (loading) {
    return <div>{t("friends.loading")}</div>;
  }

  if (requests.length === 0) {
    return <EmptyListMessage message={t("friends.noFriendRequests")} />;
  }

  return (
    <ul>
      {requests.map((req) => (
        <UserListItem
          key={req.uid}
          uid={req.from}
          onAccept={
            userUid
              ? (requestUserName?: string) =>
                  friendService.acceptFriendRequest(
                    userUid,
                    req.from,
                    currentUserName,
                    requestUserName,
                  )
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
