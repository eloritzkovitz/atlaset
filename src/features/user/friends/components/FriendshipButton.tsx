import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FaUserPlus,
  FaHourglassHalf,
  FaUserCheck,
  FaUserMinus,
  FaXmark,
} from "react-icons/fa6";
import { ConfirmModal, Menu, MenuButton } from "@components";
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
  const { t } = useTranslation("user");
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
    "adjacent",
    false,
  );

  // Confirmation states
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
        {loading ? t("friends.adding") : t("friends.addFriend")}
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
            {t("friends.pending")}
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
                ariaLabel={t("friends.withdrawRequest")}
                className="text-danger"
              >
                {t("friends.withdrawRequest")}
              </MenuButton>
            </div>
          </Menu>
        </div>
        {confirmWithdraw && (
          <ConfirmModal
            isOpen={confirmWithdraw}
            title={t("friends.withdrawConfirmTitle")}
            message={t("friends.withdrawConfirmMessage")}
            onConfirm={() => {
              setConfirmWithdraw(false);
              if (onWithdrawRequest) onWithdrawRequest();
            }}
            onCancel={() => setConfirmWithdraw(false)}
            submitLabel={t("friends.withdraw")}
            cancelLabel={t("common:actions.close")}
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
            {t("friends.friend")}
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
                ariaLabel={t("friends.unfriend")}
                className="text-danger"
              >
                {t("friends.unfriend")}
              </MenuButton>
            </div>
          </Menu>
        </div>
        {confirmUnfriend && (
          <ConfirmModal
            isOpen={confirmUnfriend}
            title={t("friends.unfriendConfirmTitle")}
            message={t("friends.unfriendConfirmMessage")}
            onConfirm={() => {
              setConfirmUnfriend(false);
              if (onUnfriend) onUnfriend();
            }}
            onCancel={() => setConfirmUnfriend(false)}
            submitLabel={t("friends.unfriend")}
            cancelLabel={t("common:actions.close")}
          />
        )}
      </>
    );
  }
  return null;
}
