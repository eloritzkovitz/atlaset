import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Card, LoadingSpinner } from "@components";
import { useFriendProfiles, useUserFriends } from "@features/user/friends";
import { FriendList } from "../../friends/components/FriendList";
import type { UserProfile } from "../types";

interface ProfileFriendsTabProps {
  profileUser: UserProfile;
}

export function ProfileFriendsTab({ profileUser }: ProfileFriendsTabProps) {
  const { t } = useTranslation("user");

  const { friends: friendObjs } = useUserFriends(profileUser.uid);
  const friendUids = useMemo(() => friendObjs.map((f) => f.uid), [friendObjs]);
  const { profiles: friendProfiles, loading } = useFriendProfiles(friendUids);

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-bold">{t("profile.friends.title")}</h2>

      {loading ? (
        <LoadingSpinner message={t("profile.friends.loading")} />
      ) : (
        <div className="mt-4">
          <FriendList profiles={friendProfiles} search="" />
        </div>
      )}
    </Card>
  );
}
