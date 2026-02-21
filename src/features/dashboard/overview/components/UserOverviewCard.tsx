import { Link } from "react-router-dom";
import { Card } from "@components";
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
  if (!userProfile || loading) return null;
  return (
    <Link
      to={`/users/${userProfile.username}`}
      className="block mb-8"
      tabIndex={0}
      aria-label="Go to your profile"
    >
      <Card className="flex items-center gap-4 p-4 sm:p-6 hover:bg-primary/20 transition cursor-pointer">
        <UserAvatar user={userProfile} size={56} />
        <div>
          <div className="text-3xl font-semibold">
            {user?.displayName || "User"}
          </div>
          <div className="text-lg text-muted">Welcome back!</div>
        </div>
      </Card>
    </Link>
  );
}
