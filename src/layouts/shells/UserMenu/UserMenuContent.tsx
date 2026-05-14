import type { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuButton, Separator, DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@contexts/UIContext";
import { ThemeToggle, useLanguage, useTheme } from "@features/settings";
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

  // Translation
  const { t } = useTranslation("common");
  const { t: tSettings } = useTranslation("settings");
  const { name } = useLanguage();
  const { openLanguagePicker } = useUI();
  const { theme, toggleTheme } = useTheme();

  // Don't render if no user
  if (!user) return null;

  const menuItems = [
    {
      label: t("menu.profile"),
      icon: <ICONS.profile className="text-lg me-2" />,
      onClick: () => {
        navigate(`/users/${username}`);
        onClose?.();
      },
      url: `/users/${username}`,
    },
    {
      label: t("menu.friends"),
      icon: <ICONS.friends className="text-lg me-2" />,
      onClick: () => {
        toggleFriends();
        onClose?.();
      },
    },
    { separator: true },
    {
      label: t("menu.reportBug"),
      icon: <ICONS.reportBug className="text-lg me-2" />,
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
            label: t("menu.keyboardShortcuts"),
            icon: <ICONS.shortcuts className="text-lg me-2" />,
            onClick: () => {
              toggleShortcuts();
              onClose?.();
            },
          },
        ]
      : []),
    { separator: true },
    {
      label: t("menu.settings"),
      icon: <ICONS.settings className="text-lg me-2" />,
      onClick: () => {
        navigate("/settings");
        onClose?.();
      },
      url: "/settings",
    },
    {
      label: `${t("menu.appearance")}: ${
        theme === "dark"
          ? tSettings("display.theme.dark")
          : tSettings("display.theme.light")
      }`,
      icon: <ICONS.appearance className="text-lg me-2" />,
      trailing: (
        <div onClick={(e) => e.stopPropagation()}>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      ),
    },
    {
      label: `${t("menu.language")}: ${name}`,
      icon: <ICONS.language className="text-lg me-2" />,
      onClick: () => {
        openLanguagePicker();
        onClose?.();
      },
      trailing: (
        <DirectionalIcon
          direction="next"
          variant="chevron"
          className="ms-auto text-lg opacity-60"
        />
      ),
    },
    { separator: true },
    {
      label: t("menu.signOut"),
      icon: <ICONS.signOut className="text-lg me-2" />,
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
            {item.trailing ? (
              <div className="ms-auto">{item.trailing}</div>
            ) : null}
          </MenuButton>
        ),
      )}
    </>
  );
}
