import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { BrandHeader, LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import { EditProfileModal, ProfileInfoCard } from "@features/user";
import { isPasswordProvider } from "@features/user/auth/utils/auth";
import { useIsMobile } from "@hooks/useIsMobile";
import { UserMenu } from "@layout/UserMenu/UserMenu";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const isMobile = useIsMobile();

  // Only allow editing for email/password users
  const canEdit = isPasswordProvider(user);

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

  return (
    <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
      <BrandHeader />
      <div className="flex-1 p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 w-full">
        {/* Hide UserMenu on mobile for clarity */}
        {!isMobile && <UserMenu />}
        <main className="flex-1 p-4 md:p-8 mt-10 md:mt-16 bg-surface rounded-lg shadow overflow-auto min-h-0">
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
