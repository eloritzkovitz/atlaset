import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { HamburgerButton, LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import {
  AccountSettingsSection,
  DisplaySettingsSection,
  SettingsPanelMenu,
} from "@features/settings";
import {
  EditProfileModal,
  SecurityInfoSection,
  UserActivitySection,
} from "@features/user";
import { useIsMobile } from "@hooks/useIsMobile";
import { UserMenu } from "@layout/UserMenu/UserMenu";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Only allow editing for email/password users
  const canEdit = user?.providerData?.[0]?.providerId === "password";

  // Show loading spinner while auth state is loading
  if (loading) {
    return <LoadingSpinner />;
  }

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
    : "account";

  // Handle menu navigation
  function handlePanelChange(panel: string) {
    if (panel === "activity") {
      navigate("/settings/activity");
    } else if (panel === "security") {
      navigate("/settings/security");
    } else if (panel === "display") {
      navigate("/settings/display");
    } else {
      navigate("/settings/account");
    }
    setPanelOpen(false);
  }

  return (
    <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
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
            <Routes>
              <Route path="account" element={<AccountSettingsSection />} />
              <Route path="display" element={<DisplaySettingsSection />} />
              <Route path="activity" element={<UserActivitySection />} />
              <Route path="security" element={<SecurityInfoSection />} />
              {/* Redirect unknown profile routes to /settings */}
              <Route
                path="*"
                element={<Navigate to="/settings/account" replace />}
              />
            </Routes>
          </div>
        </main>
      </div>
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
