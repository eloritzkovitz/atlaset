import type { User } from "firebase/auth";
import { ActionButton } from "@components";
import { UserAvatar } from "@features/user";

interface UserAvatarButtonProps {
  user: User | null;
  onClick: () => void;
}

export function UserAvatarButton({ user, onClick }: UserAvatarButtonProps) {
  return (
    <ActionButton
      className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none hover:bg-transparent bg-transparent"
      onClick={onClick}
      aria-label="User menu"
      title="Account"
    >
      <UserAvatar user={user} size={36} />
    </ActionButton>
  );
}
