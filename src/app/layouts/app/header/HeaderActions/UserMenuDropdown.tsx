import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ResponsiveOverlay,
  type AnimatedTriggeredOverlayProps,
} from "@components";
import { ICONS } from "@constants/icons";
import { useLanguage } from "@features/settings/account";
import { useAuth, useAuthHandlers } from "@features/user/auth";
import { UserMenuContent } from "./UserMenuContent";

export function UserMenuDropdown({
  triggerRef,
  isOpen,
  onClose,
  closing = false,
}: AnimatedTriggeredOverlayProps) {
  const { user } = useAuth();
  const { handleLogout } = useAuthHandlers();
  const { isRtl } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <ResponsiveOverlay
      isOpen={isOpen}
      closing={closing}
      onClose={onClose}
      triggerRef={triggerRef}
      desktopPlacement={isRtl ? "bottom-start" : "bottom-end"}
      desktopClassName="z-50 w-70 p-2"
      mobileHeader={
        <div className="flex justify-end">
          <ActionButton
            onClick={onClose}
            ariaLabel={t("actions.close")}
            title={t("actions.close")}
            icon={<ICONS.close className="text-2xl" />}
            rounded
          />
        </div>
      }
    >
      <UserMenuContent user={user} onLogout={handleLogout} onClose={onClose} />
    </ResponsiveOverlay>
  );
}
