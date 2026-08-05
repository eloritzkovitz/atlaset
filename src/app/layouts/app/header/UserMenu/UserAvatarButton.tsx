import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import type { SerializableUser } from "@features/user/auth/types";
import { UserAvatar } from "@features/user/profile";

interface UserAvatarButtonProps {
  user: SerializableUser | null;
  onClick: () => void;
}

export function UserAvatarButton({ user, onClick }: UserAvatarButtonProps) {
  const { t } = useTranslation("common");

  return (
    <ActionButton
      className="w-9 h-9 rounded-full flex items-center justify-center focus:outline-none hover:bg-transparent bg-transparent"
      onClick={onClick}
      aria-label={t("navigation.menu.account")}
      title={t("navigation.menu.account")}
    >
      <UserAvatar user={user} size={36} />
    </ActionButton>
  );
}
