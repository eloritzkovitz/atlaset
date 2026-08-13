import { DropdownMenu } from "@components";
import { useAuth, useAuthHandlers } from "@features/user/auth";
import { useLanguage } from "@features/settings";
import { useScreenSize } from "@hooks";
import { UserMenuContent } from "./UserMenuContent";

interface UserMenuDropdownProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  closing?: boolean;
}

export function UserMenuDropdown({
  triggerRef,
  isOpen,
  onClose,
  closing = false,
}: UserMenuDropdownProps) {
  const { user } = useAuth();
  const { handleLogout } = useAuthHandlers();
  const { isRtl } = useLanguage();
  const { isMobile } = useScreenSize();

  const isMenuVisible = isOpen || closing;

  const className = isMobile
    ? "fixed inset-x-0 bottom-0 z-50 w-full max-w-full rounded-t-2xl p-4 bg-surface shadow-lg"
    : "z-50 p-2 w-70";

  const style = isMobile
    ? {
        top: "unset",
        bottom: 16,
      }
    : undefined;

  return (
    <DropdownMenu
      isOpen={isMenuVisible}
      onClose={onClose}
      triggerRef={triggerRef}
      floating={!isMobile}
      placement={isRtl ? "bottom-start" : "bottom-end"}
      className={className}
      style={style}
    >
      <UserMenuContent user={user} onLogout={handleLogout} onClose={onClose} />
    </DropdownMenu>
  );
}
