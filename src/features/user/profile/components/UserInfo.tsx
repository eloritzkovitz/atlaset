import type { User } from "firebase/auth";
import { UserAvatar } from "./UserAvatar";
import type { UserProfile } from "../../types";

interface UserInfoProps {
  user: User | UserProfile | null;
  avatarSize?: number;
  showDisplayName?: boolean;
  showEmail?: boolean;
  showUsername?: boolean;
}

export function UserInfo({
  user,
  avatarSize = 40,
  showDisplayName = false,
  showEmail = false,
  showUsername = false,
}: UserInfoProps) {
  return (
    <div className="p-2 flex items-center gap-3">
      <UserAvatar user={user} size={avatarSize} />
      <div>
        {showDisplayName && (
          <div className="font-medium mb-1">
            {user?.displayName || user?.email}
          </div>
        )}
        {showEmail && <div className="text-muted text-sm">{user?.email}</div>}
        {showUsername && (
          <div className="text-muted text-sm">
            @{user?.displayName?.replace(/\s+/g, "").toLowerCase() || "user"}
          </div>
        )}
      </div>
    </div>
  );
}
