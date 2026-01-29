import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { HamburgerButton } from "@components";
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
import { useIsMobile } from "@hooks";
import { UserMenu } from "@layout/UserMenu/UserMenu";

export default function ProfilePage() {
  const { user, loading: userLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const [editOpen, setEditOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Only allow editing for email/password users
  const canEdit = user?.providerData?.[0]?.providerId === "password";

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
    setPanelOpen(false);
  }

  // Page title based on selected panel
  const panelTitles: Record<string, string> = {
    account: "Account",
    display: "Display",
    sound: "Sound",
    activity: "User Activity",
    security: "Security",
  };
  const pageTitle = `${panelTitles[selectedPanel] || "Settings"} | Atlaset`;

  return (
    <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
      <title>{pageTitle}</title>
      {/* Hamburger for mobile */}
      {isMobile && <HamburgerButton onClick={() => setPanelOpen(true)} />}
      <div className="flex-1 p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 w-full">
        {/* Hide UserMenu on mobile for clarity */}
        {!isMobile && <UserMenu />}
        <SettingsPanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={handlePanelChange}
          canEdit={canEdit}
          open={isMobile ? panelOpen : undefined}
          onClose={isMobile ? () => setPanelOpen(false) : undefined}
        />

        <main className="flex-1 flex flex-col items-center px-2 md:px-12 py-10 md:py-16 min-h-screen">
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
        </main>
      </div>
      <EditProfileModal
        user={user}
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
