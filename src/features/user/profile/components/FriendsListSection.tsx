import { SectionHeader } from "@components";
import { useTranslation } from "react-i18next";
import { FriendList } from "../../friends/components/FriendList";
import type { UserProfile } from "../../types";

interface FriendsListSectionProps {
  loading: boolean;
  profiles: UserProfile[];
  onBack: () => void;
}

export function FriendsListSection({
  loading,
  profiles,
  onBack,
}: FriendsListSectionProps) {
  const { t } = useTranslation("user");

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title={t("friends.friends")} className="text-2xl mb-0" />
        <button
          className="text-muted hover:text-primary text-lg font-semibold"
          onClick={onBack}
        >
          {t("profile.header.backToProfile")}
        </button>
      </div>
      {loading ? (
        <div>{t("friends.loading")}</div>
      ) : (
        <FriendList profiles={profiles} search="" />
      )}
    </div>
  );
}
