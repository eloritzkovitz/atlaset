import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TabButton } from "@components";
import type { UserProfile } from "../../types";

interface ProfileTabNavProps {
  profileUser: UserProfile;
}

export function ProfileTabNav({ profileUser }: ProfileTabNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("user");

  const overviewPath = `/users/${profileUser.username}`;
  const friendsPath = `/users/${profileUser.username}/friends`;

  const isOverviewActive = location.pathname === overviewPath;
  const isFriendsActive = location.pathname.startsWith(friendsPath);

  return (
    <div className="flex gap-2">
      <TabButton
        active={isOverviewActive}
        onClick={() => navigate(overviewPath)}
      >
        {t("profile.tabs.about", "About")}
      </TabButton>

      <TabButton active={isFriendsActive} onClick={() => navigate(friendsPath)}>
        <div className="flex items-center gap-2">
          <span>{t("profile.tabs.friends", "Friends")}</span>
        </div>
      </TabButton>
    </div>
  );
}
