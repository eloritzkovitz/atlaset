import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import {
  AccessibilitySettingsSection,
  AccountSettingsSection,
  DisplaySettingsSection,
  PrivacySettingsSection,
  SecurityInfoSection,
  SettingsPanelMenu,
} from "@features/settings";
import { SETTINGS_MENU } from "@features/settings/common/constants/settingsMenu";
import { EditProfileModal, useUserProfile } from "@features/user/profile";
import { usePageTitle } from "@hooks";
import { SidebarLayout } from "@layouts";

const PANEL_COMPONENTS: Record<string, React.ReactNode> = {
  account: <AccountSettingsSection />,
  display: <DisplaySettingsSection />,
  accessibility: <AccessibilitySettingsSection />,
  privacy: <PrivacySettingsSection />,
  security: <SecurityInfoSection />,
};

export default function SettingsPage() {
  const { user, loading: userLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const [editOpen, setEditOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("settings");

  // Determine selected panel and title from route
  const activePanel =
    SETTINGS_MENU.find((item) => location.pathname.endsWith(item.url)) ||
    SETTINGS_MENU[0];
  const selectedPanel = activePanel.key;

  const pageTitle = t(`settings.panels.${activePanel.key}`, activePanel.label);
  usePageTitle(pageTitle);

  // Only allow editing for email/password users
  const canEdit = user?.providerData?.[0]?.providerId === "password";

  // Handle menu navigation
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
          <Routes>
            {SETTINGS_MENU.map((item) => {
              const relativePath = item.url.split("/").pop() || "";

              return (
                <Route
                  key={item.key}
                  path={relativePath}
                  element={PANEL_COMPONENTS[item.key] ?? undefined}
                />
              );
            })}

            {/* Catch-all fallback redirect */}
            <Route
              path="*"
              element={<Navigate to="/settings/account" replace />}
            />
          </Routes>
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
