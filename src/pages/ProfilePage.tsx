import { useState } from "react";
import { useParams } from "react-router-dom";
import { SplashScreen } from "@components";
import {
  EditProfileModal,
  ProfileInfoCard,
  VisitedCountriesCard,
  useAuth,
  useUserProfile,
} from "@features/user";
import { Footer, Header } from "@layout";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const { profile: profileUser, loading: profileLoading } = useUserProfile({
    username,
  });
  const [editOpen, setEditOpen] = useState(false);

  // Show loading spinner while fetching data
  if (authLoading || profileLoading) return <SplashScreen />;

  // Handle case where user not found
  if (!profileUser) return <div>User not found</div>;

  // Determine if this is the current user's own profile
  const canEdit = currentUser && currentUser.uid === profileUser?.uid;

  return (
    <>
      <div className="relative h-screen w-screen bg-bg overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-full max-w-4xl">
              <ProfileInfoCard
                profile={profileUser}
                canEdit={!!canEdit}
                onEdit={() => setEditOpen(true)}
              />
              <VisitedCountriesCard
                visitedCountryCodes={profileUser.visitedCountryCodes || []}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {canEdit && (
        <EditProfileModal
          user={currentUser}
          profile={profileUser}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}
