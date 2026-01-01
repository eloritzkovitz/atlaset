import type { User } from "firebase/auth";
import {
  FaGear,
  FaKeyboard,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MenuButton, Separator } from "@components";
import { useUI } from "@contexts/UIContext";
import { useFirestoreUsername } from "@features/user";
import { useIsMobile } from "@hooks";
import { UserInfo } from "./UserInfo";

interface UserMenuProps {
  user: User | null;
  loading: boolean;
  onLogout: () => void;
}

export function UserMenuContent({ user, loading, onLogout }: UserMenuProps) {
  const { toggleShortcuts } = useUI();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        <UserInfo user={user} />
        <Separator />
        <MenuButton
          onClick={() => navigate(`/users/${username}`)}
          icon={<FaUser className="text-lg mr-2" />}
          ariaLabel="Profile"
          title="Profile"
          className="w-full"
        >
          Profile
        </MenuButton>
        <MenuButton
          onClick={() => navigate("/settings")}
          icon={<FaGear className="text-lg mr-2" />}
          ariaLabel="Settings"
          title="Settings"
          className="w-full"
        >
          Settings
        </MenuButton>
        {!isMobile && (
          <MenuButton
            onClick={toggleShortcuts}
            icon={<FaKeyboard className="text-lg mr-2" />}
            ariaLabel="Keyboard Shortcuts"
            title="Keyboard Shortcuts"
            className="w-full"
          >
            Keyboard Shortcuts
          </MenuButton>
        )}
        <MenuButton
          onClick={onLogout}
          icon={<FaRightFromBracket className="text-lg mr-2" />}
          ariaLabel="Sign out"
          title="Sign out"
          className="w-full"
        >
          Sign out
        </MenuButton>
      </>
    );
  }
}
