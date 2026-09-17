import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";

interface FriendRequestActionsProps {
  displayName?: string;
  onAccept: (displayName?: string) => void;
  onReject: () => void;
}

export function FriendRequestActions({
  displayName,
  onAccept,
  onReject,
}: FriendRequestActionsProps) {
  const { t } = useTranslation("user");

  return (
    <div className="flex gap-1 ms-2">
      <ActionButton
        onClick={() => onAccept(displayName)}
        title={t("friends.actions.accept")}
        ariaLabel={t("friends.actions.accept")}
        icon={<ICONS.selected />}
        className="text-success"
        rounded
      />

      <ActionButton
        onClick={onReject}
        title={t("friends.actions.reject")}
        ariaLabel={t("friends.actions.reject")}
        icon={<ICONS.close />}
        className="text-danger"
        rounded
      />
    </div>
  );
}
