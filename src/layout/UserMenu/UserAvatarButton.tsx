import { UserAvatar } from "../UserAvatar/UserAvatar";

interface UserAvatarButtonProps {
  user: any;
  onClick: () => void;
}

export function UserAvatarButton({ user, onClick }: UserAvatarButtonProps) {
  return (
    <button
      className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none bg-transparent"
      onClick={onClick}
      aria-label="User menu"
    >
      <UserAvatar user={user} size={36} />
    </button>
  );
}
