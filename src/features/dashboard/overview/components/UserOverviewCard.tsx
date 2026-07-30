import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@components";
import { UserAvatar, type UserProfile } from "@features/user/profile";
import type { SerializableUser } from "@features/user/auth/types";

interface UserOverviewCardProps {
  userProfile: UserProfile;
  user: SerializableUser | null;
  loading: boolean;
}

export function UserOverviewCard({
  userProfile,
  user,
  loading,
}: UserOverviewCardProps) {
  const { t } = useTranslation("dashboard");

  if (!userProfile || loading) return null;
  return (
    <Link
      to={`/users/${userProfile.username}`}
      aria-label={t("overview.goToProfile", {
        defaultValue: "Go to your profile",
      })}
      className="block mb-8 rounded-2xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
    >
      <Card className="flex items-center gap-4 p-4 sm:p-6 hover:bg-primary/20 transition cursor-pointer">
        <UserAvatar user={userProfile} size={56} />
        <div>
          <div className="text-3xl font-semibold">
            {user?.displayName || t("overview.user", { defaultValue: "User" })}
          </div>
          <div className="text-start text-lg text-muted">
            {t("overview.welcomeBack", { defaultValue: "Welcome back!" })}
          </div>
        </div>
      </Card>
    </Link>
  );
}
