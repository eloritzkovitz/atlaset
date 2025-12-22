import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@components";
import { useAuth } from "@contexts/AuthContext";
import {
  EditProfileModal,
  ProfileInfoCard,
  VisitedCountriesCard,
} from "@features/user";
import { isPasswordProvider } from "@features/user/auth/utils/auth";
import { Header } from "@layout";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

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
    <>
      <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-full max-w-4xl">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <ProfileInfoCard
                        user={user}
                        email={user?.email || ""}
                        joinDate={joinDate}
                        canEdit={canEdit}
                        onEdit={() => setEditOpen(true)}
                      />
                      <VisitedCountriesCard />
                    </>
                  }
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
      <EditProfileModal
        user={user}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
