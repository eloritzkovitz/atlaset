import type { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { UserAvatar } from "@features/user/profile";

interface UserAvatarButtonProps {
  user: User | null;
  onClick: () => void;
}

export function UserAvatarButton({ user, onClick }: UserAvatarButtonProps) {
  const { t } = useTranslation("common");

  return (
    <ActionButton
      className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none hover:bg-transparent bg-transparent"
      onClick={onClick}
      aria-label={t("menu.account")}
      title={t("menu.account")}
    >
      <UserAvatar user={user} size={36} />
    </ActionButton>
  );
}
