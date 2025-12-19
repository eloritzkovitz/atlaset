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
import { AccountSettingsList, SettingsPanelMenu } from "@features/settings";
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
    : "account";

  // Handle menu navigation
  function handlePanelChange(panel: string) {
    if (panel === "activity") {
      navigate("/settings/activity");
    } else if (panel === "security") {
      navigate("/settings/security");
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

        <main className="flex-1 p-4 md:p-8 mt-10 md:mt-16 bg-surface rounded-lg shadow overflow-auto min-h-0">
          <Routes>
            <Route
              path="/account"
              element={<AccountSettingsList />}
            />
            <Route path="activity" element={<UserActivitySection />} />
            <Route path="security" element={<SecurityInfoSection />} />
            {/* Redirect unknown profile routes to /settings */}
            <Route
              path="*"
              element={<Navigate to="/settings/account" replace />}
            />
          </Routes>
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
