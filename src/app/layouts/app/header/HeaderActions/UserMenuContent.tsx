import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MenuButton, Separator, DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import { useLanguage } from "@features/settings/account";
import { useTheme } from "@features/settings/display/hooks/useTheme";
import type { SerializableUser } from "@features/user/auth/types";
import { UserInfo, useUserProfile } from "@features/user/profile";
import { useScreenSize } from "@hooks";
import { LanguageSubmenu } from "./LanguageSubmenu";
import { ThemeSubmenu } from "./ThemeSubmenu";

interface UserMenuProps {
  user: SerializableUser | null;
  onLogout: () => void;
  onClose?: () => void;
}

export function UserMenuContent({ user, onLogout, onClose }: UserMenuProps) {
  const navigate = useNavigate();
  const { name } = useLanguage();
  const { isMobile } = useScreenSize();
  const { theme, setTheme } = useTheme();
  const { toggleFriends, toggleShortcuts } = useUI();
  const { profile } = useUserProfile({ uid: user?.uid ?? undefined });

  const { t } = useTranslation("common");

  const [activeSubmenu, setActiveSubmenu] = useState<
    "main" | "theme" | "language"
  >("main");

  // Don't render if no user
  if (!user) return null;

  // Render Submenu for Theme Selection
  if (activeSubmenu === "theme") {
    return (
      <ThemeSubmenu
        currentTheme={theme}
        onThemeSelect={(nextTheme) => setTheme(nextTheme)}
        onBack={() => setActiveSubmenu("main")}
      />
    );
  }

  if (activeSubmenu === "language") {
    return <LanguageSubmenu onBack={() => setActiveSubmenu("main")} />;
  }

  // Primary Main Menu Layout
  const menuItems = [
    {
      label: t("navigation.menu.profile"),
      icon: <ICONS.profile className="text-lg" />,
      onClick: () => {
        navigate(`/users/${profile?.username}`);
        onClose?.();
      },
      url: `/users/${profile?.username}`,
    },
    {
      label: t("navigation.menu.friends"),
      icon: <ICONS.friends className="text-lg" />,
      onClick: () => {
        toggleFriends();
        onClose?.();
      },
    },
    { separator: true },
    {
      label: t("navigation.menu.settings"),
      icon: <ICONS.settings className="text-lg" />,
      onClick: () => {
        navigate("/settings");
        onClose?.();
      },
      url: "/settings",
    },
    {
      label: `${t("navigation.menu.appearance.title")}: ${t(`navigation.menu.appearance.${theme}`)}`,
      icon: <ICONS.appearance className="text-lg" />,
      onClick: () => {
        setActiveSubmenu("theme");
      },
      trailing: (
        <DirectionalIcon
          direction="next"
          variant="chevron"
          className="ms-auto text-lg opacity-60"
        />
      ),
    },
    {
      label: `${t("navigation.menu.language")}: ${name}`,
      icon: <ICONS.language className="text-lg" />,
      onClick: () => {
        setActiveSubmenu("language");
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
    ...(!isMobile
      ? [
          {
            label: t("navigation.menu.keyboardShortcuts"),
            icon: <ICONS.shortcuts className="text-lg" />,
            onClick: () => {
              toggleShortcuts();
              onClose?.();
            },
          },
        ]
      : []),
    {
      label: t("navigation.menu.reportBug"),
      icon: <ICONS.reportBug className="text-lg" />,
      onClick: () => {
        window.open(
          "https://github.com/eloritzkovitz/atlaset/issues",
          "_blank",
        );
        onClose?.();
      },
      url: "https://github.com/eloritzkovitz/atlaset/issues",
    },
    { separator: true },
    {
      label: t("navigation.menu.signOut"),
      icon: <ICONS.signOut className="text-lg" />,
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
