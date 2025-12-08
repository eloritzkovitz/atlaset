import { UserAvatar } from "@features/user";

export function UserInfo({ user }: { user: any }) {
  return (
    <div className="p-2 flex items-center gap-3">
      <UserAvatar user={user} size={40} />
      <div>
        <div className="font-medium mb-1">{user.displayName || user.email}</div>
        <div className="text-sm text-gray-400">{user.email}</div>
      </div>
    </div>
  );
}
