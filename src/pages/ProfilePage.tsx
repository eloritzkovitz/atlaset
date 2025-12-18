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
  EditProfileModal,
  ProfilePanelMenu,
  ProfileInfoCard,
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

  // Format join date from user metadata
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : null;

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
    : "profile";

  // Handle menu navigation
  function handlePanelChange(panel: string) {
    if (panel === "activity") {
      navigate("/profile/activity");
    } else if (panel === "security") {
      navigate("/profile/security");
    } else {
      navigate("/profile");
    }
    setPanelOpen(false);
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Hamburger for mobile */}
      {isMobile && <HamburgerButton onClick={() => setPanelOpen(true)} />}
      <div className="p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Hide UserMenu on mobile for clarity */}
        {!isMobile && <UserMenu />}
        <ProfilePanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={handlePanelChange}
          canEdit={canEdit}
          open={isMobile ? panelOpen : undefined}
          onClose={isMobile ? () => setPanelOpen(false) : undefined}
        />

        <main className="flex-1 p-4 md:p-8 mt-10 md:mt-16 bg-surface rounded-lg shadow">
          <Routes>
            <Route
              path="/"
              element={
                <ProfileInfoCard
                  user={user}
                  email={user?.email || ""}
                  joinDate={joinDate}
                  canEdit={canEdit}
                  onEdit={() => setEditOpen(true)}
                />
              }
            />
            <Route path="activity" element={<UserActivitySection />} />
            <Route path="security" element={<SecurityInfoSection />} />
            {/* Redirect unknown profile routes to /profile */}
            <Route path="*" element={<Navigate to="/profile" replace />} />
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
