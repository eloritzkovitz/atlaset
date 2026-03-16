import type { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { useFirestoreUsername, UserInfo } from "@features/user";
import { useScreenSize } from "@hooks";

interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
  onClose?: () => void;
}

export function UserMenuContent({ user, onLogout, onClose }: UserMenuProps) {
  const { toggleFriends, toggleShortcuts } = useUI();
  const navigate = useNavigate();
  const { isMobile } = useScreenSize();
  const { username } = useFirestoreUsername(user?.uid);

  // Don't render if no user
  if (!user) return null;

  const menuItems = [
    {
      label: "Profile",
      icon: <ICONS.profile className="text-lg mr-2" />,
      onClick: () => {
        navigate(`/users/${username}`);
        onClose?.();
      },
      url: `/users/${username}`,
    },
    {
      label: "Friends",
      icon: <ICONS.friends className="text-lg mr-2" />,
      onClick: () => {
        toggleFriends();
        onClose?.();
      },
    },
    { separator: true },
    {
      label: "Report a Bug",
      icon: <ICONS.reportBug className="text-lg mr-2" />,
      onClick: () => {
        window.open(
          "https://github.com/eloritzkovitz/atlaset/issues",
          "_blank",
        );
        onClose?.();
      },
      url: "https://github.com/eloritzkovitz/atlaset/issues",
    },
    ...(!isMobile
      ? [
          {
            label: "Keyboard Shortcuts",
            icon: <ICONS.shortcuts className="text-lg mr-2" />,
            onClick: () => {
              toggleShortcuts();
              onClose?.();
            },
          },
        ]
      : []),
    { separator: true },
    {
      label: "Settings",
      icon: <ICONS.settings className="text-lg mr-2" />,
      onClick: () => {
        navigate("/settings");
        onClose?.();
      },
      url: "/settings",
    },
    { separator: true },
    {
      label: "Sign out",
      icon: <ICONS.signOut className="text-lg mr-2" />,
      onClick: () => {
        onLogout();
        onClose?.();
      },
    },
  ];

  return (
    <>
      <UserInfo user={user} showDisplayName showUsername />
      <Separator />
      {menuItems.map((item, idx) =>
        item.separator ? (
          <Separator className="my-1" key={idx} />
        ) : (
          <MenuButton
            key={idx}
            onClick={item.onClick}
            icon={item.icon}
            ariaLabel={item.label}
            className="w-full"
            url={item.url}
          >
            <span className="font-semibold">{item.label}</span>
          </MenuButton>
        ),
      )}
    </>
  );
}
