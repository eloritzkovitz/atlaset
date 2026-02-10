import { useState, useRef } from "react";
import { ConfirmModal } from "@components";
import {
  FaUserPlus,
  FaHourglassHalf,
  FaUserCheck,
  FaUserMinus,
  FaXmark,
} from "react-icons/fa6";
import { Menu, MenuButton } from "@components";
import { useMenuPosition } from "@hooks";

interface FriendshipButtonProps {
  friendStatus: "none" | "pending" | "friend";
  loading: boolean;
  onAddFriend: () => void;
  onUnfriend?: () => void;
  onWithdrawRequest?: () => void;
}

export function FriendshipButton({
  friendStatus,
  loading,
  onAddFriend,
  onUnfriend,
  onWithdrawRequest,
}: FriendshipButtonProps) {
  // All hooks must be called unconditionally and in the same order
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuStyle = useMenuPosition(
    showMenu,
    btnRef,
    menuRef,
    45,
    "right",
    false,
  );

  // Handlers for menu actions
  // Confirmation modal states
  const [confirmUnfriend, setConfirmUnfriend] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  const handleUnfriend = () => {
    setShowMenu(false);
    setTimeout(() => {
      setConfirmUnfriend(true);
    }, 100);
  };
  const handleWithdraw = () => {
    setShowMenu(false);
    setTimeout(() => {
      setConfirmWithdraw(true);
    }, 100);
  };

  // Render button based on friendship status
  if (friendStatus === "none") {
    return (
      <button
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-success text-white rounded-full hover:bg-green-700 transition"
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
      <>
        <div ref={containerRef} className="inline-block relative">
          <button
            ref={btnRef}
            className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-warning text-white rounded-full hover:bg-yellow-600 transition"
            onClick={() => setShowMenu((v) => !v)}
            type="button"
            disabled={loading}
          >
            <FaHourglassHalf className="text-lg" />
            Pending
          </button>
          <Menu
            open={showMenu}
            onClose={() => setShowMenu(false)}
            containerRef={containerRef}
            style={menuStyle}
          >
            <div ref={menuRef}>
              <MenuButton
                icon={<FaXmark className="text-danger" />}
                onClick={handleWithdraw}
                ariaLabel="Withdraw Request"
                className="text-danger"
              >
                Withdraw Request
              </MenuButton>
            </div>
          </Menu>
        </div>
        {confirmWithdraw && (
          <ConfirmModal
            isOpen={confirmWithdraw}
            title={"Withdraw friend request"}
            message={"Are you sure you want to withdraw your friend request?"}
            onConfirm={() => {
              setConfirmWithdraw(false);
              if (onWithdrawRequest) onWithdrawRequest();
            }}
            onCancel={() => setConfirmWithdraw(false)}
            submitLabel="Withdraw"
            cancelLabel="Cancel"
          />
        )}
      </>
    );
  }

  if (friendStatus === "friend") {
    return (
      <>
        <div ref={containerRef} className="inline-block relative">
          <button
            ref={btnRef}
            className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-info text-white rounded-full hover:bg-blue-700 transition"
            onClick={() => setShowMenu((v) => !v)}
            type="button"
          >
            <FaUserCheck className="text-lg" />
            Friend
          </button>
          <Menu
            open={showMenu}
            onClose={() => setShowMenu(false)}
            containerRef={containerRef}
            style={menuStyle}
          >
            <div ref={menuRef}>
              <MenuButton
                icon={<FaUserMinus className="text-danger" />}
                onClick={handleUnfriend}
                ariaLabel="Unfriend"
                className="text-danger"
              >
                Unfriend
              </MenuButton>
            </div>
          </Menu>
        </div>
        {confirmUnfriend && (
          <ConfirmModal
            isOpen={confirmUnfriend}
            title={"Remove friend"}
            message={"Are you sure you want to remove this friend?"}
            onConfirm={() => {
              setConfirmUnfriend(false);
              if (onUnfriend) onUnfriend();
            }}
            onCancel={() => setConfirmUnfriend(false)}
            submitLabel="Remove"
            cancelLabel="Cancel"
          />
        )}
      </>
    );
  }
  return null;
}
