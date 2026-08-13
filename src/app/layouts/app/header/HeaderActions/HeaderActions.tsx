import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import {
  NotificationsDropdown,
  useNotifications,
} from "@features/notifications";
import { useAuth } from "@features/user/auth";
import { useModalAnimation, useScreenSize } from "@hooks";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuDropdown } from "./UserMenuDropdown";
import { AuthButtons } from "../AuthButtons";

/** Renders the top navigation header actions. */
export function HeaderActions({ fixed = true }: { fixed?: boolean } = {}) {
  const { user } = useAuth();
  const { toggleSearch, toggleHelp } = useUI();
  const { isOpen, closing, closeModal, setIsOpen } = useModalAnimation();
  const { unreadCount } = useNotifications(user?.uid);
  const { t } = useTranslation("common");

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const { isMobile } = useScreenSize();
  const isTripsPage = location.pathname.startsWith("/trips");

  // Close menus on route change
  useEffect(() => {
    if (isOpen) closeModal();
    if (notificationsOpen) setNotificationsOpen(false);
  }, [location.pathname, isOpen, notificationsOpen, closeModal]);

  // Don't render the user menu on mobile if on the trips page
  if (isMobile && isTripsPage) return null;

  // Render Auth Buttons if no user is logged in
  if (!user) {
    return (
      <div className="fixed top-0 end-2 z-20">
        <AuthButtons />
      </div>
    );
  }

  return (
    <div
      className={`${fixed ? "fixed top-4 end-4" : ""} z-20 flex items-center gap-4`}
    >
      {isMobile && (
        <ActionButton
          title={t("navigation.menu.search")}
          onClick={toggleSearch}
          icon={<ICONS.search className="text-xl" />}
          aria-pressed={false}
        />
      )}

      {/* Notifications */}
      <div className="relative">
        <ActionButton
          ref={notificationsButtonRef}
          title={t("navigation.menu.notifications")}
          onClick={() => {
            if (isOpen) closeModal();
            setNotificationsOpen((v) => !v);
          }}
          icon={<ICONS.notifications className="text-xl" />}
          aria-pressed={notificationsOpen}
          rounded
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -end-1 pointer-events-none flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
      <NotificationsDropdown
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        triggerRef={notificationsButtonRef}
      />

      {/* Help */}
      <ActionButton
        title={t("navigation.menu.help")}
        onClick={toggleHelp}
        icon={<ICONS.help className="text-xl" />}
        aria-pressed={false}
        rounded
      />

      {/* User Menu */}
      <UserAvatarButton
        ref={avatarButtonRef}
        user={user}
        onClick={() => {
          if (notificationsOpen) setNotificationsOpen(false);
          setIsOpen((v) => !v);
        }}
      />
      <UserMenuDropdown
        triggerRef={avatarButtonRef}
        isOpen={isOpen}
        closing={closing}
        onClose={closeModal}
      />
    </div>
  );
}
