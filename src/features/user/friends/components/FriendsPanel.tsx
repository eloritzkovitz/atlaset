import { useEffect, useState } from "react";
import { FaUserGroup, FaUserPlus, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, SearchInput, Separator } from "@components";
import { useAuth } from "@contexts/AuthContext";
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "@features/user/friends/services/friendService";
import type { Friend, FriendRequest } from "../../types";

interface FriendsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function FriendsPanel({ open, onClose }: FriendsPanelProps) {
  const { user } = useAuth();
  const [showRequests, setShowRequests] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch friends or requests based on current view
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (showRequests) {
      getFriendRequests(user.uid).then((reqs) => {
        setRequests(reqs);
        setLoading(false);
      });
    } else {
      getFriends(user.uid).then((frs) => {
        setFriends(frs);
        setLoading(false);
      });
    }
  }, [user, showRequests]);

  return (
    <Panel
      show={open}
      onHide={onClose}
      title={
        <>
          {showRequests ? (
            <FaUserPlus className="mr-2" />
          ) : (
            <FaUserGroup className="mr-2" />
          )}
          {showRequests ? "Friend Requests" : "Friends"}
        </>
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
        {loading ? (
          <div>Loading...</div>
        ) : showRequests ? (
          <ul>
            {requests.length === 0 ? (
              <li>No friend requests.</li>
            ) : (
              requests.map((req) => (
                <li
                  key={req.uid}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <span>{req.from}</span>
                  <div>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => user?.uid && acceptFriendRequest(user.uid, req.from)}
                      disabled={!user?.uid}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => user?.uid && rejectFriendRequest(user.uid, req.from)}
                      disabled={!user?.uid}
                    >
                      Reject
                    </button>
                  </div>
                </li>
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
              {friends.length === 0 ? (
                <li>No friends yet.</li>
              ) : (
                friends
                  .filter((friend) =>
                    friend.uid.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((friend) => (
                    <li key={friend.uid} className="py-2 border-b">
                      {friend.uid}
                    </li>
                  ))
              )}
            </ul>
          </>
        )}
      </div>
    </Panel>
  );
}
