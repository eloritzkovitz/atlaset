import { useTranslation } from "react-i18next";
import { DialogHeader, ResponsiveOverlay } from "@components";
import { useAuth } from "@features/user/auth";
import { NotificationsContent } from "./NotificationsContent";
import { useNotifications } from "../hooks/useNotifications";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export function NotificationsDropdown({
  isOpen,
  onClose,
  triggerRef,
}: NotificationsDropdownProps) {
  const { user } = useAuth();
  const { notifications, loading } = useNotifications(user?.uid, { limit: 3 });
  const { t } = useTranslation("common");

  if (!user) return null;

  return (
    <ResponsiveOverlay
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      desktopClassName="z-50 h-[380px] w-[350px] p-2"
      mobileHeader={
        <DialogHeader
          title={t("notifications:title", "Notifications")}
          onClose={onClose}
          showSeparator={false}
        />
      }
    >
      <NotificationsContent notifications={notifications} loading={loading} />
    </ResponsiveOverlay>
  );
}
