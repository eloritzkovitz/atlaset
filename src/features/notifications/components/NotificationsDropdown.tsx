import { DropdownMenu } from "@components";
import { useAuth } from "@features/user/auth";
import { useScreenSize } from "@hooks";
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
  const { isMobile } = useScreenSize();
  const { notifications, loading } = useNotifications(user?.uid);

  if (!user) return null;

  const className = isMobile
    ? "fixed inset-x-0 bottom-0 z-50 w-full max-w-full rounded-t-2xl p-4 bg-surface shadow-lg"
    : "z-50 p-2 w-[350px]";

  const style: React.CSSProperties | undefined = isMobile
    ? {
        top: "unset",
        bottom: 16,
      }
    : undefined;

  return (
    <DropdownMenu
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      className={className}
      style={style}
    >
      <NotificationsContent notifications={notifications} loading={loading} />
    </DropdownMenu>
  );
}
