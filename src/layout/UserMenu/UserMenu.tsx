import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ActionButton, Menu } from "@components";
import { ICONS } from "@constants/icons";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useAuthHandlers } from "@features/user";
import { useModalAnimation, useScreenSize } from "@hooks";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";
import { AuthButtons } from "../Header/AuthButtons";

/** Renders the user menu. */
export function UserMenu({ fixed = true }: { fixed?: boolean } = {}) {
  const { user } = useAuth();
  const { toggleSearch, toggleHelp } = useUI();
  const { isOpen, closing, closeModal, setIsOpen } = useModalAnimation();
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="fixed top-0 right-2 z-20">
        <AuthButtons />
      </div>
    );
  }

  return (
    <div
      className={`${
        fixed ? "fixed top-4 right-4" : ""
      } z-20 flex items-center gap-4`}
      ref={menuRef}
    >
      {isMobile && (
        <>
          <ActionButton
            title="Search"
            onClick={() => {
              toggleSearch();
            }}
            icon={<ICONS.search className="text-xl" />}
            aria-pressed={false}
          />
        </>
      )}
      <ActionButton
        title="Notifications"
        onClick={() => {}}
        icon={<ICONS.notifications className="text-xl" />}
        aria-pressed={false}
        rounded
      />
      <ActionButton
        title="Help"
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
              : "absolute right-4 mt-3 w-60 z-50 p-2"
          }
          style={
            isMobile
              ? { top: "unset", right: "unset", left: 0, bottom: 16 }
              : { top: "48px", right: 16 }
          }
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
