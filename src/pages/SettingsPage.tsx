import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import {
  AccountSettingsSection,
  DisplaySettingsSection,
  SecurityInfoSection,
  SettingsPanelMenu,
  SoundSettingsSection,
} from "@features/settings";
import {
  EditProfileModal,
  UserActivitySection,
  useUserProfile,
} from "@features/user";
import { usePageTitle } from "@hooks";
import { SidebarLayout } from "@layout";

export default function SettingsPage() {
  const { user, loading: userLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine selected panel from route
  const selectedPanel = location.pathname.endsWith("/activity")
    ? "activity"
    : location.pathname.endsWith("/security")
      ? "security"
      : location.pathname.endsWith("/display")
        ? "display"
        : location.pathname.endsWith("/sound")
          ? "sound"
          : "account";

  // Page title based on selected panel
  const panelTitles: Record<string, string> = {
    account: "Account",
    display: "Display",
    sound: "Sound",
    activity: "User Activity",
    security: "Security",
  };
  const pageTitle = `${panelTitles[selectedPanel] || "Settings"}`;

  // Set page title dynamically
  usePageTitle(pageTitle);

  // Only allow editing for email/password users
  const canEdit = user?.providerData?.[0]?.providerId === "password";

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle menu navigation
  function handlePanelChange(panel: string) {
    if (panel === "activity") {
      navigate("/settings/activity");
    } else if (panel === "security") {
      navigate("/settings/security");
    } else if (panel === "display") {
      navigate("/settings/display");
    } else if (panel === "sound") {
      navigate("/settings/sound");
    } else {
      navigate("/settings/account");
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
      contentClassName="min-h-screen"
    >
      <div className="w-full max-w-2xl">
        {userLoading || profileLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-surface-alt rounded-xl mb-4" />
            <div className="h-40 bg-surface-alt rounded-xl mb-4" />
            <div className="h-20 bg-surface-alt rounded-xl" />
          </div>
        ) : (
          <Routes>
            <Route path="account" element={<AccountSettingsSection />} />
            <Route path="display" element={<DisplaySettingsSection />} />
            <Route path="sound" element={<SoundSettingsSection />} />
            <Route path="activity" element={<UserActivitySection />} />
            <Route path="security" element={<SecurityInfoSection />} />
            {/* Redirect unknown profile routes to /settings */}
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
