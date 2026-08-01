import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@components";
import type { SerializableUser } from "@features/user/auth/types";
import { UserAvatar, type UserProfile } from "@features/user/profile";

interface UserOverviewCardProps {
  userProfile?: UserProfile | null;
  user: SerializableUser | null;
  loading: boolean;
}

export function UserOverviewCard({
  userProfile,
  user,
  loading,
}: UserOverviewCardProps) {
  const { t } = useTranslation("dashboard");

  if (!loading && !userProfile) return null;

  const isInteractive = !loading && !!userProfile?.username;

  const content = (
    <Card
      className={`flex items-center gap-4 p-4 sm:p-6 transition ${
        isInteractive ? "hover:bg-primary/20 cursor-pointer" : ""
      }`}
    >
      {loading ? (
        <>
          <div className="w-[56px] h-[56px] rounded-full bg-input animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 w-full max-w-[200px] animate-pulse">
            <div className="h-7 w-3/4 bg-input rounded" />
            <div className="h-5 w-1/2 bg-input rounded" />
          </div>
        </>
      ) : (
        <>
          {userProfile && <UserAvatar user={userProfile} size={56} />}
          <div>
            <div className="text-3xl font-semibold">
              {user?.displayName ||
                t("overview.user", { defaultValue: "User" })}
            </div>
            <div className="text-start text-lg text-muted">
              {t("overview.welcomeBack", { defaultValue: "Welcome back!" })}
            </div>
          </div>
        </>
      )}
    </Card>
  );

  if (!isInteractive) {
    return <div className="mb-8">{content}</div>;
  }

  return (
    <Link
      to={`/users/${userProfile.username}`}
      aria-label={t("overview.goToProfile", {
        defaultValue: "Go to your profile",
      })}
      className="block mb-8 rounded-2xl outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus"
    >
      {content}
    </Link>
  );
}
