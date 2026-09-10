import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { TabControl, type TabControlItem } from "@components";
import type { UserProfile } from "../../types";

type ProfileTab = "overview" | "friends" | "visits";

interface ProfileTabNavProps {
  profileUser: UserProfile;
}

export function ProfileTabNav({ profileUser }: ProfileTabNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("user");

  const overviewPath = `/users/${profileUser.username}`;
  const friendsPath = `/users/${profileUser.username}/friends`;
  const visitsPath = `/users/${profileUser.username}/visits`;

  const isFriendsActive = location.pathname.startsWith(friendsPath);
  const isVisitsActive = location.pathname.startsWith(visitsPath);

  const activeTab: ProfileTab = isFriendsActive
    ? "friends"
    : isVisitsActive
      ? "visits"
      : "overview";

  const tabs: TabControlItem<ProfileTab>[] = [
    {
      value: "overview",
      label: t("profile.tabs.about", "About"),
    },
    {
      value: "friends",
      label: t("profile.tabs.friends", "Friends"),
    },
    {
      value: "visits",
      label: t("profile.tabs.visits", "Visits"),
    },
  ];

  const handleTabChange = (tab: ProfileTab) => {
    switch (tab) {
      case "overview":
        navigate(overviewPath);
        break;
      case "friends":
        navigate(friendsPath);
        break;
      case "visits":
        navigate(visitsPath);
        break;
    }
  };

  return (
    <TabControl tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
  );
}
