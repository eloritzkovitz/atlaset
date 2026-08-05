import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useParams,
  Navigate,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Card, EmptyListMessage } from "@components";
import { useAuth } from "@features/user/auth";
import {
  useFriendshipStatus,
  useUserFriendCount,
} from "@features/user/friends";
import {
  EditProfileModal,
  ProfileAboutTab,
  ProfileFriendsTab,
  ProfileHeader,
  ProfileTabNav,
  useUserProfile,
} from "@features/user/profile";
import { usePageTitle } from "@hooks";

export default function ProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { username } = useParams();
  const { t } = useTranslation("user");

  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  // Fetch Profile User
  const { profile: profileUser, loading: profileLoading } = useUserProfile({
    username,
    refreshKey: profileRefreshKey,
  });

  const { status: friendshipStatus, loading: friendshipLoading } =
    useFriendshipStatus(currentUser?.uid, profileUser?.uid);

  const isLoading = authLoading || profileLoading || friendshipLoading;
  const canEdit = Boolean(
    currentUser && profileUser && currentUser.uid === profileUser.uid,
  );
  const isPrivateProfileRestricted = Boolean(
    profileUser &&
    !profileUser.isPublic &&
    !canEdit &&
    friendshipStatus !== "friend",
  );
  const isIndexingAllowed = profileUser?.isSearchIndexingAllowed ?? true;

  // Page Title
  usePageTitle(profileUser?.displayName || "Profile");

  // Friend Count
  const { count: friendCount } = useUserFriendCount(profileUser?.uid);

  // Handle loading state
  if (isLoading) {
    return (
      <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0 mt-12">
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full max-w-4xl space-y-6 animate-pulse">
            <div className="h-32 bg-surface-alt rounded-xl mb-4" />
            <div className="h-20 bg-surface-alt rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  // Redirect if user is not logged in or profile is private and user cannot edit
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if profile is private and user cannot edit or view
  if (profileUser && !isIndexingAllowed && !canEdit) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0 mt-12">
        <div className="flex flex-col gap-6 items-center">
          <div className="w-full max-w-4xl space-y-6">
            {profileUser ? (
              <>
                {/* Header */}
                <ProfileHeader
                  profile={profileUser}
                  canEdit={canEdit}
                  onEdit={() => setEditOpen(true)}
                  friendCount={friendCount}
                  onFriendCountClick={() =>
                    navigate(`/users/${profileUser.username}/friends`)
                  }
                />

                {isPrivateProfileRestricted ? (
                  <Card>
                    <p className="text-center text-muted py-4">
                      {t("profile.private", "This profile is private.")}
                    </p>
                  </Card>
                ) : (
                  <>
                    {/* Tab Navigation */}
                    <ProfileTabNav profileUser={profileUser} />

                    {/* Sub-Routes */}
                    <Routes>
                      <Route
                        index
                        element={
                          <ProfileAboutTab
                            profileUser={profileUser}
                            canEdit={canEdit}
                          />
                        }
                      />
                      <Route
                        path="friends"
                        element={
                          <ProfileFriendsTab profileUser={profileUser} />
                        }
                      />
                    </Routes>
                  </>
                )}
              </>
            ) : (
              <EmptyListMessage message={t("profile.notFound")} />
            )}
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {canEdit && profileUser && (
        <EditProfileModal
          user={currentUser}
          profile={profileUser}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={() => setProfileRefreshKey((k) => k + 1)}
        />
      )}
    </>
  );
}
