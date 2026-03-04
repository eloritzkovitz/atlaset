import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { useFirestoreUsername, UserInfo } from "@features/user";
import { useScreenSize } from "@hooks";

interface UserMenuProps {
  user: User | null;
  loading: boolean;
  onLogout: () => void;
  onClose?: () => void;
}

export function UserMenuContent({
  user,
  loading,
  onLogout,
  onClose,
}: UserMenuProps) {
  const { toggleFriends, toggleShortcuts } = useUI();
  const navigate = useNavigate();
  const { isMobile } = useScreenSize();

  // Fetch username for profile link
  const { username } = useFirestoreUsername(user?.uid);

  // Show loading state
  if (loading) {
    return <div className="p-2 text-center">Loading...</div>;
  }

  // Show menu content
  if (user) {
    return (
      <>
        <UserInfo user={user} showDisplayName={true} showUsername={true} />
        <Separator />
        <MenuButton
          onClick={() => {
            navigate(`/users/${username}`);
            onClose?.();
          }}
          icon={<ICONS.profile className="text-lg mr-2" />}
          ariaLabel="Profile"
          className="w-full"
        >
          Profile
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleFriends();
            onClose?.();
          }}
          icon={<ICONS.friends className="text-lg mr-2" />}
          ariaLabel="Friends"
          className="w-full"
        >
          Friends
        </MenuButton>
        <Separator className="my-1" />
        <MenuButton
          onClick={() => {
            window.open(
              "https://github.com/eloritzkovitz/atlaset/issues",
              "_blank",
            );
            onClose?.();
          }}
          icon={<ICONS.reportBug className="text-lg mr-2" />}
          ariaLabel="Report a Bug"
          className="w-full"
        >
          Report a Bug
        </MenuButton>
        {!isMobile && (
          <MenuButton
            onClick={() => {
              toggleShortcuts();
              onClose?.();
            }}
            icon={<ICONS.shortcuts className="text-lg mr-2" />}
            ariaLabel="Keyboard Shortcuts"
            className="w-full"
          >
            Keyboard Shortcuts
          </MenuButton>
        )}
        <Separator className="my-1" />
        <MenuButton
          onClick={() => {
            navigate("/settings");
            onClose?.();
          }}
          icon={<ICONS.settings className="text-lg mr-2" />}
          ariaLabel="Settings"
          className="w-full"
        >
          Settings
        </MenuButton>
        <Separator className="my-1" />
        <MenuButton
          onClick={() => {
            onLogout();
            onClose?.();
          }}
          icon={<ICONS.signOut className="text-lg mr-2" />}
          ariaLabel="Sign out"
          className="w-full"
        >
          Sign out
        </MenuButton>
      </>
    );
  }
}
