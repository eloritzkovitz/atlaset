import { FaGear, FaKeyboard, FaRightFromBracket, FaUser } from "react-icons/fa6";
import { MenuButton, Separator } from "@components";
import { useUI } from "@contexts/UIContext";
import { UserInfo } from "./UserInfo";

interface UserMenuProps {
  user: any;
  loading: boolean;
  onSignIn: () => void;
  onLogout: () => void;
}

export function UserMenuContent({
  user,
  loading,
  onSignIn,
  onLogout,
}: UserMenuProps) {
  const { toggleSettings, toggleShortcuts } = useUI();

  if (loading) {
    return <div className="p-2 text-center">Loading...</div>;
  }
  if (user) {
    return (
      <>
        <UserInfo user={user} />
        <Separator />
        <MenuButton
          onClick={() => {}}
          icon={<FaUser className="text-lg mr-2" />}
          ariaLabel="Profile"
          title="Profile"
          className="w-full"
        >
          Profile
        </MenuButton>
        <MenuButton
          onClick={toggleSettings}
          icon={<FaGear className="text-lg mr-2" />}
          ariaLabel="Settings"
          title="Settings"
          className="w-full"
        >
          Settings
        </MenuButton>
        <MenuButton
          onClick={toggleShortcuts}
          icon={<FaKeyboard className="text-lg mr-2" />}
          ariaLabel="Keyboard Shortcuts"
          title="Keyboard Shortcuts"
          className="w-full"
        >
          Keyboard Shortcuts
        </MenuButton>
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
  return (
    <button
      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={onSignIn}
    >
      Sign in with Google
    </button>
  );
}
