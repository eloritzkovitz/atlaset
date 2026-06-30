import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Panel, SearchInput, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { FriendList } from "./FriendList";
import { FriendRequestList } from "./FriendRequestList";
import { useUserFriends } from "../hooks/useUserFriends";
import { useFriendProfiles } from "../hooks/useFriendProfiles";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useAuth } from "../../auth/hooks/useAuth";

interface FriendsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FriendsPanel({ open, onClose }: FriendsPanelProps) {
  const { t } = useTranslation("user");
  const { user } = useAuth();
  const { friends } = useUserFriends();
  const [search, setSearch] = useState("");
  const [showRequests, setShowRequests] = useState(false);

  // Get friend UIDs and profiles
  const friendUids = useMemo(() => friends.map((f) => f.uid), [friends]);
  const { profiles: friendProfiles } = useFriendProfiles(friendUids);
  const { requests, loading: loadingRequests } = useFriendRequests(
    showRequests && user ? user.uid : undefined,
  );

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <span className="flex items-center gap-2">
          {showRequests ? <ICONS.friendRequests /> : <ICONS.friends />}
          {showRequests ? t("friends.friendRequests") : t("friends.friends")}
        </span>
      }
      headerActions={
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={() => setShowRequests((prev) => !prev)}
            ariaLabel={
              showRequests
                ? t("friends.showFriends")
                : t("friends.showRequests")
            }
            title={
              showRequests ? t("friends.friends") : t("friends.friendRequests")
            }
            icon={showRequests ? <ICONS.friends /> : <ICONS.friendRequests />}
            rounded
          />
        </div>
      }
      showSeparator={showRequests ? true : false}
    >
      <div className="flex flex-col h-full">
        {showRequests ? (
          <FriendRequestList
            requests={requests}
            loading={loadingRequests}
            userUid={user?.uid}
          />
        ) : (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("friends.searchPlaceholder")}
              className="flex-1 h-10"
            />
            <Separator className="my-4" />
            <FriendList profiles={friendProfiles} search={search} />
          </>
        )}
      </div>
    </Panel>
  );
}
