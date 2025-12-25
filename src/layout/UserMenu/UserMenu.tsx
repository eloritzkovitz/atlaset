import { useRef, useEffect } from "react";
import { FaBell, FaUserGroup } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { ActionButton, Menu } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { useUI } from "@contexts/UIContext";
import { useAuthHandlers } from "@features/user";
import { useIsMobile } from "@hooks/useIsMobile";
import { useModalAnimation } from "@hooks/useModalAnimation";
import { UserAvatarButton } from "./UserAvatarButton";
import { UserMenuContent } from "./UserMenuContent";

export function UserMenu() {
  const { user, loading } = useAuth();
  const { uiVisible, showFriends, toggleFriends } = useUI();
  const { isOpen, closing, closeModal, setIsOpen } = useModalAnimation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Router states and navigation
  const navigate = useNavigate();
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
      <div className="fixed top-4 right-4 md:right-10 z-20 flex gap-2">
        <button
          className="py-2 px-4 bg-primary text-white rounded-full hover:bg-primary-hover"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
        <button
          className="py-2 px-4 bg-secondary text-primary rounded-full hover:bg-secondary-hover"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed top-4 right-4 md:right-10 z-20 flex items-center gap-4"
      ref={menuRef}
    >
      {!isSettingsPage && (
        <>
          <ActionButton
            title="Friends"
            onClick={toggleFriends}
            icon={<FaUserGroup className="text-xl" />}
            aria-pressed={showFriends}
            rounded
          />
          <ActionButton
            title="Notifications"
            onClick={() => {}}
            icon={<FaBell className="text-xl" />}
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
