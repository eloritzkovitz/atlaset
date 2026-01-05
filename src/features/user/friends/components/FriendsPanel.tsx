import { useState } from "react";
import { FaUserGroup, FaUserPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, SearchInput, Separator } from "@components";
import { UserListItem } from "./UserListItem";
import { useFriends } from "../hooks/useFriends";
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
  const { requests, loading: loadingRequests } = useFriendRequests(
    showRequests && user ? user.uid : undefined
  );

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <ActionButton
            onClick={() => setShowRequests((prev) => !prev)}
            ariaLabel={showRequests ? "Show Friends" : "Show Requests"}
            title={showRequests ? "Friends" : "Requests"}
            icon={showRequests ? <FaUserGroup /> : <FaUserPlus />}
            rounded
          />
          {showRequests ? "Friend Requests" : "Friends"}
        </>
      }
      headerActions={
        <div className="flex items-center gap-2">
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
      className="!z-[10050]"
    >
      <div className="flex flex-col h-full">
        {(showRequests ? loadingRequests : loadingFriends) ? (
          <div>Loading...</div>
        ) : showRequests ? (
          <ul>
            {requests.length === 0 ? (
              <li>No friend requests.</li>
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
              placeholder="Search friends..."
              className="flex-1 h-10"
            />
            <Separator className="my-4" />
            <ul>
              {(() => {
                const filtered = friends.filter((friend) =>
                  friend.uid.toLowerCase().includes(search.toLowerCase())
                );
                if (friends.length === 0 && !search) {
                  return <li>No friends yet.</li>;
                }
                if (filtered.length === 0) {
                  return <li>No users found.</li>;
                }
                return filtered.map((friend) => (
                  <UserListItem key={friend.uid} uid={friend.uid} />
                ));
              })()}
            </ul>
          </>
        )}
      </div>
    </Panel>
  );
}
