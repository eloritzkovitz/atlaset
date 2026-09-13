import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { FriendRequestActions } from "./FriendRequestActions";
import { friendService } from "../services/friendService";
import { UserListItem } from "../../core/components/UserListItem";

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
  const { t } = useTranslation("user");

  if (loading) {
    return <div>{t("friends.status.loading")}</div>;
  }

  if (requests.length === 0) {
    return <EmptyListMessage message={t("friends.empty.noFriendRequests")} />;
  }

  return (
    <ul className="space-y-2">
      {requests.map((req) => (
        <UserListItem
          key={req.uid}
          uid={req.from}
          actions={
            userUid ? (
              <FriendRequestActions
                onAccept={(requestUserName) =>
                  friendService.acceptFriendRequest(
                    userUid,
                    req.from,
                    requestUserName,
                  )
                }
                onReject={() =>
                  friendService.rejectFriendRequest(userUid, req.from)
                }
              />
            ) : undefined
          }
        />
      ))}
    </ul>
  );
}
