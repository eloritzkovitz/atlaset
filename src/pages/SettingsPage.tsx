import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarLayout } from "@app/layouts/app/SidebarLayout";
import { SettingsPanelMenu } from "@features/settings/common/components/SettingsPanelMenu";
import { SETTINGS_MENU } from "@features/settings/common/constants/settingsMenu";
import { useAuth } from "@features/user/auth";
import { EditProfileModal, useUserProfile } from "@features/user/profile";
import { usePageTitle } from "@hooks";

export default function SettingsPage() {
  const { user, loading: userLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const [editOpen, setEditOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("settings");

  const activePanel =
    SETTINGS_MENU.find((item) => location.pathname.endsWith(item.url)) ||
    SETTINGS_MENU[0];
  const selectedPanel = activePanel.key;

  const pageTitle = t(`settings.panels.${activePanel.key}`, activePanel.label);
  usePageTitle(pageTitle);

  const canEdit = user?.providerId === "password";

  function handlePanelChange(panelKey: string) {
    const targetItem = SETTINGS_MENU.find((item) => item.key === panelKey);
    if (targetItem) {
      navigate(targetItem.url);
    }
  }

  return (
    <SidebarLayout
      menu={
        <SettingsPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={handlePanelChange}
          canEdit={canEdit}
        />
      }
      contentClassName="w-4xl"
    >
      <div>
        {userLoading || profileLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-surface-alt rounded-xl mb-4" />
            <div className="h-40 bg-surface-alt rounded-xl mb-4" />
            <div className="h-20 bg-surface-alt rounded-xl" />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <EditProfileModal
        user={user}
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </SidebarLayout>
  );
}
