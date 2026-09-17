import { useTranslation } from "react-i18next";
import { EmptyListMessage } from "@components";
import { FriendRequestActions } from "./FriendRequestActions";
import { friendService } from "../services/friendService";
import { UserList } from "../../core/components/UserList";

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
    <UserList
      uids={requests.map((request) => request.from)}
      getActions={(uid) =>
        userUid ? (
          <FriendRequestActions
            onAccept={(requestUserName) =>
              friendService.acceptFriendRequest(userUid, uid, requestUserName)
            }
            onReject={() => friendService.rejectFriendRequest(userUid, uid)}
          />
        ) : undefined
      }
    />
  );
}
