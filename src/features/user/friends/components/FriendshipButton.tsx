import { FaUserPlus, FaHourglassHalf } from "react-icons/fa6";

interface FriendshipButtonProps {
  friendStatus: "none" | "pending" | "friend";
  loading: boolean;
  onAddFriend: () => void;
}

export function FriendshipButton({
  friendStatus,
  loading,
  onAddFriend,
}: FriendshipButtonProps) {
  if (friendStatus === "none") {
    return (
      <button
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        onClick={onAddFriend}
        disabled={loading}
      >
        <FaUserPlus className="text-lg" />
        {loading ? "Adding..." : "Add Friend"}
      </button>
    );
  }
  if (friendStatus === "pending") {
    return (
      <button
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-yellow-500 text-white rounded-full cursor-not-allowed"
        disabled
      >
        <FaHourglassHalf className="text-lg" />
        Pending
      </button>
    );
  }
  if (friendStatus === "friend") {
    return (
      <button
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-gray-400 text-white rounded-full cursor-default"
        disabled
      >
        Friend
      </button>
    );
  }
  return null;
}
