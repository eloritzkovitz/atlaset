import { Link } from "react-router-dom";
import { Card } from "@components";
import { useTranslation } from "react-i18next";
import {
  UserAvatar,
  type SerializableUser,
  type UserProfile,
} from "@features/user";

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
      className="block mb-8"
      tabIndex={0}
      aria-label={t("overview.goToProfile", {
        defaultValue: "Go to your profile",
      })}
    >
      <Card className="flex items-center gap-4 p-4 sm:p-6 hover:bg-primary/20 transition cursor-pointer">
        <UserAvatar user={userProfile} size={56} />
        <div>
          <div className="text-3xl font-semibold">
            {user?.displayName || t("overview.user", { defaultValue: "User" })}
          </div>
          <div className="text-lg text-muted">
            {t("overview.welcomeBack", { defaultValue: "Welcome back!" })}
          </div>
        </div>
      </Card>
    </Link>
  );
}
