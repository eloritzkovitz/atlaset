import { useState, useMemo } from "react";
import { FaUserGroup, FaUserPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, SearchInput, Separator } from "@components";
import { UserListItem } from "./UserListItem";
import { useFriends } from "../hooks/useFriends";
import { useFriendProfiles } from "../hooks/useFriendProfiles";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useAuth } from "../../auth/hooks/useAuth";
import { friendService } from "../../friends/services/friendService";

interface FriendsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FriendsPanel({ open, onClose }: FriendsPanelProps) {
  const { user } = useAuth();
  const { friends, loading: loadingFriends } = useFriends();
  const [search, setSearch] = useState("");
  const [showRequests, setShowRequests] = useState(false);

  // Memoize friend UIDs to avoid unnecessary re-fetches
  const friendUids = useMemo(() => friends.map((f) => f.uid), [friends]);
  const { profiles: friendProfiles, loading: loadingProfiles } =
    useFriendProfiles(friendUids);
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
          {showRequests ? <FaUserPlus /> : <FaUserGroup />}
          {showRequests ? "Friend Requests" : "Friends"}
        </span>
      }
      headerActions={
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={() => setShowRequests((prev) => !prev)}
            ariaLabel={showRequests ? "Show Friends" : "Show Requests"}
            title={showRequests ? "Friends" : "Requests"}
            icon={showRequests ? <FaUserGroup /> : <FaUserPlus />}
            rounded
          />
          <ActionButton
            onClick={onClose}
            ariaLabel="Close friends panel"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </div>
      }
      showSeparator={showRequests ? true : false}
    >
      <div className="flex flex-col h-full">
        {(
          showRequests ? loadingRequests : loadingFriends || loadingProfiles
        ) ? (
          <div>Loading...</div>
        ) : showRequests ? (
          <ul>
            {requests.length === 0 ? (
              <div className="mt-4 text-muted text-sm flex justify-center">
                No friend requests.
              </div>
            ) : (
              requests.map((req) => (
                <UserListItem
                  key={req.uid}
                  uid={req.from}
                  onAccept={
                    user?.uid
                      ? () =>
                          friendService.acceptFriendRequest(user.uid, req.from)
                      : undefined
                  }
                  onReject={
                    user?.uid
                      ? () =>
                          friendService.rejectFriendRequest(user.uid, req.from)
                      : undefined
                  }
                />
              ))
            )}
          </ul>
        ) : (
          <>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search friends"
              className="flex-1 h-10"
            />
            <Separator className="my-4" />
            <ul>
              {(() => {
                const q = search.toLowerCase();
                const filtered = friendProfiles.filter(
                  (profile) =>
                    profile.username.toLowerCase().includes(q) ||
                    profile.displayName.toLowerCase().includes(q),
                );
                if (friendProfiles.length === 0 && !search) {
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
                return filtered.map((profile) => (
                  <div className="mb-2" key={profile.uid}>
                    <UserListItem uid={profile.uid} />
                  </div>
                ));
              })()}
            </ul>
          </>
        )}
      </div>
    </Panel>
  );
}
