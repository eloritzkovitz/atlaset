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
  const [activeModal, setActiveModal] = useState<
    "unfriend" | "withdraw" | null
  >(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const menuStyle = useMenuPosition(
    showMenu,
    btnRef,
    menuRef,
    0,
    "right",
    "adjacent",
    false,
  );

  // Add friend button
  if (friendStatus === "none") {
    return (
      <button
        className="w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 bg-primary text-text hover:bg-primary-hover font-medium rounded-full transition disabled:opacity-50"
        onClick={onAddFriend}
        disabled={loading}
        type="button"
      >
        <FaUserPlus className="text-base" />
        {loading ? t("friends.status.adding") : t("friends.actions.addFriend")}
      </button>
    );
  }

  const isPending = friendStatus === "pending";

  // Configure button and menu based on friendship status
  const config = isPending
    ? {
        buttonClass: "bg-surface hover:bg-surface-hover",
        icon: <FaHourglassHalf />,
        label: t("friends.status.pending"),
        menuIcon: <FaXmark className="!text-danger" />,
        menuLabel: t("friends.actions.withdrawRequest"),
        onMenuClick: () => {
          setShowMenu(false);
          setActiveModal("withdraw");
        },
      }
    : {
        buttonClass: "bg-surface hover:bg-surface-hover",
        icon: <FaUserCheck />,
        label: t("friends.status.friend"),
        menuIcon: <FaUserMinus className="!text-danger" />,
        menuLabel: t("friends.actions.unfriend"),
        onMenuClick: () => {
          setShowMenu(false);
          setActiveModal("unfriend");
        },
      };

  return (
    <>
      <div
        ref={containerRef}
        className="inline-block relative w-full sm:w-auto"
      >
        <button
          ref={btnRef}
          className={`w-full sm:w-auto px-4 py-2 flex items-center justify-center gap-2 font-medium rounded-full transition ${config.buttonClass}`}
          onClick={() => setShowMenu((v) => !v)}
          type="button"
          disabled={loading}
        >
          {config.icon}
          {config.label}
        </button>

        <Menu
          open={showMenu}
          onClose={() => setShowMenu(false)}
          containerRef={containerRef}
          style={menuStyle}
        >
          <div ref={menuRef}>
            <MenuButton
              icon={config.menuIcon}
              onClick={config.onMenuClick}
              ariaLabel={config.menuLabel}
              className="text-danger"
            >
              <span className="!text-danger">{config.menuLabel}</span>
            </MenuButton>
          </div>
        </Menu>
      </div>

      {/* Confirmation Modal handling */}
      <ConfirmModal
        isOpen={activeModal === "withdraw"}
        title={t("friends.actions.withdrawConfirmTitle")}
        message={t("friends.actions.withdrawConfirmMessage")}
        onConfirm={() => {
          setActiveModal(null);
          onWithdrawRequest?.();
        }}
        onCancel={() => setActiveModal(null)}
        submitLabel={t("friends.actions.withdraw")}
        cancelLabel={t("common:actions.close")}
      />

      <ConfirmModal
        isOpen={activeModal === "unfriend"}
        title={t("friends.actions.unfriendConfirmTitle")}
        message={t("friends.actions.unfriendConfirmMessage")}
        onConfirm={() => {
          setActiveModal(null);
          onUnfriend?.();
        }}
        onCancel={() => setActiveModal(null)}
        submitLabel={t("friends.actions.unfriend")}
        cancelLabel={t("common:actions.close")}
      />
    </>
  );
}
