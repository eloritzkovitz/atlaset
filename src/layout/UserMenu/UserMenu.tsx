import { useRef, useEffect } from "react";
import { FaBell, FaCircleQuestion } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { ActionButton, Menu } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useAuthHandlers } from "@features/user";
import { useIsMobile, useModalAnimation } from "@hooks";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";
import { AuthButtons } from "../Header/AuthButtons";

export function UserMenu({ fixed = true }: { fixed?: boolean } = {}) {
  const { user, loading } = useAuth();
  const { uiVisible } = useUI();
  const { isOpen, closing, closeModal, setIsOpen } = useModalAnimation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Router states and navigation
  const location = useLocation();
  const isMobile = useIsMobile();
  const isTripsPage = location.pathname.startsWith("/trips");
  const isSettingsPage = location.pathname.startsWith("/settings");

  // Get the logout handler from useAuthHandlers
  const { handleLogout } = useAuthHandlers();

  // Close menu on route change
  useEffect(() => {
    if (isOpen) closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Don't render if UI is not visible
  if (!uiVisible) return null;
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
      {!isSettingsPage && (
        <>
          <ActionButton
            title="Notifications"
            onClick={() => {}}
            icon={<FaBell className="text-xl" />}
            aria-pressed={false}
            rounded
          />
          <ActionButton
            title="Help"
            onClick={() => {}}
            icon={<FaCircleQuestion className="text-xl" />}
            aria-pressed={false}
            rounded
          />
        </>
      )}
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
            loading={loading}
            onLogout={handleLogout}
          />
        </Menu>
      )}
    </div>
  );
}
