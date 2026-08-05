import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ActionButton, Menu } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { useLanguage } from "@features/settings";
import { useAuth, useAuthHandlers } from "@features/user/auth";
import { useModalAnimation, useScreenSize } from "@hooks";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";
import { AuthButtons } from "../AuthButtons";

/** Renders the user menu. */
export function UserMenu({ fixed = true }: { fixed?: boolean } = {}) {
  const { user } = useAuth();
  const { toggleSearch, toggleHelp } = useUI();
  const { isOpen, closing, closeModal, setIsOpen } = useModalAnimation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Language and translation
  const { t } = useTranslation("common");
  const { isRtl } = useLanguage();

  // Router states and navigation
  const location = useLocation();
  const { isMobile } = useScreenSize();
  const isTripsPage = location.pathname.startsWith("/trips");

  // Get the logout handler from useAuthHandlers
  const { handleLogout } = useAuthHandlers();

  // Close menu on route change
  useEffect(() => {
    if (isOpen) closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Don't render if viewing trips in mobile
  if (isMobile && isTripsPage) return null;

  // Show login/signup buttons if not logged in
  if (!user) {
    return (
      <div className="fixed top-0 end-2 z-20">
        <AuthButtons />
      </div>
    );
  }

  return (
    <div
      className={`${
        fixed ? "fixed top-4 end-4" : ""
      } z-20 flex items-center gap-4`}
      ref={menuRef}
    >
      {isMobile && (
        <>
          <ActionButton
            title={t("navigation.menu.search")}
            onClick={() => {
              toggleSearch();
            }}
            icon={<ICONS.search className="text-xl" />}
            aria-pressed={false}
          />
        </>
      )}
      <ActionButton
        title={t("navigation.menu.notifications")}
        onClick={() => {}}
        icon={<ICONS.notifications className="text-xl" />}
        aria-pressed={false}
        rounded
      />
      <ActionButton
        title={t("navigation.menu.help")}
        onClick={() => {
          toggleHelp();
        }}
        icon={<ICONS.help className="text-xl" />}
        aria-pressed={false}
        rounded
      />
      <UserAvatarButton user={user} onClick={() => setIsOpen((v) => !v)} />
      {(isOpen || closing) && (
        <Menu
          open={isOpen}
          onClose={closeModal}
          className={
            isMobile
              ? "fixed inset-x-0 bottom-0 z-50 w-full max-w-full rounded-t-2xl p-4 bg-surface shadow-lg"
              : "absolute mt-3 w-70 z-50 p-2"
          }
          style={
            isMobile
              ? { top: "unset", right: "unset", left: 0, bottom: 16 }
              : isRtl
                ? { top: "48px", left: 24 }
                : { top: "48px", right: 24 }
          }
          disableScroll
        >
          <UserMenuContent
            user={user}
            onLogout={handleLogout}
            onClose={closeModal}
          />
        </Menu>
      )}
    </div>
  );
}
