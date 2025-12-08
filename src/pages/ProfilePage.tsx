import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import {
  EditProfileModal,
  ProfilePanelMenu,
  ProfileInfoCard,
  UserActivitySection,
} from "@features/user";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    : "profile";

  // Handle menu navigation
  function handlePanelChange(panel: string) {
    if (panel === "activity") {
      navigate("/profile/activity");
    } else {
      navigate("/profile");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 max-w-4xl mx-auto flex gap-6">
        <ProfilePanelMenu
          selectedPanel={selectedPanel}
          setSelectedPanel={handlePanelChange}
          canEdit={canEdit}
        />

        <main className="flex-1 p-8 mt-16 bg-white dark:bg-gray-800 rounded shadow">
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
