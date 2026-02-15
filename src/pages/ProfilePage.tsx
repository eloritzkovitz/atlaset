import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@features/countries";
import { useUserLeaderboardScores } from "@features/quizzes";
import {
  BestScoresCard,
  EditProfileModal,
  FriendsListSection,
  ProfileAboutCard,
  ProfileHeader,
  VisitedCountriesCard,
  useUserProfile,
  useUserFriendCount,
  useFriendProfiles,
  useUserFriends,
} from "@features/user";
import { usePageTitle } from "@hooks";
import { Header } from "@layout";
import { AppPanels } from "@layout/Layout/AppPanels";
import { formatFirestoreDate } from "@utils/date";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const { profile: profileUser, loading: profileLoading } = useUserProfile({
    username,
  });
  const [editOpen, setEditOpen] = useState(false);
  // Modal open state is now based on route
  const friendsOpen = location.pathname.endsWith("/friends");
  const bestScores = useUserLeaderboardScores(profileUser?.uid);

  // Set the page title to the profile user's displayName if available
  usePageTitle(
    profileUser && profileUser.displayName
      ? `${profileUser.displayName} | Atlaset`
      : "Profile | Atlaset",
  );

  // Determine if this is the current user's own profile
  const canEdit = currentUser && currentUser.uid === profileUser?.uid;

  // Get country data for the user's home country
  const { countries } = useCountryData();
  const selectedCountry = profileUser
    ? (countries.find((c) => c.isoCode === profileUser.homeCountry) ?? null)
    : null;

  // Get friend count and friend profiles for the profile user
  const { count: friendCount } = useUserFriendCount(profileUser?.uid);
  const { friends: friendObjs } = useUserFriends(
    friendsOpen && profileUser?.uid ? profileUser.uid : undefined,
  );
  const friendUids = friendObjs.map((f) => f.uid);
  const { profiles: friendProfiles, loading: loadingFriendProfiles } =
    useFriendProfiles(friendUids);

  // Show loading state while fetching auth and profile data
  if (!profileUser && !(authLoading || profileLoading))
    return <div>User not found</div>;

  // When opening the modal, just navigate
  const handleOpenFriends = () => {
    if (!profileUser?.uid) return;
    navigate(`/users/${profileUser.username}/friends`, { replace: false });
  };

  // Handle closing the modal by navigating back to the main profile route
  const handleCloseFriends = () => {
    navigate(`/users/${profileUser?.username}`);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen h-screen w-screen bg-bg overflow-x-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0">
          <div className="flex flex-col gap-6 items-center">
            <div className="w-full max-w-4xl">
              {authLoading || profileLoading ? (
                <div className="animate-pulse space-y-6">
                  <div className="h-32 bg-surface-alt rounded-xl mb-4" />
                  <div className="h-20 bg-surface-alt rounded-xl" />
                </div>
              ) : profileUser ? (
                <>
                  <ProfileHeader
                    profile={profileUser}
                    canEdit={!!canEdit}
                    onEdit={() => setEditOpen(true)}
                    friendCount={friendCount}
                    onFriendCountClick={handleOpenFriends}
                  />
                  {friendsOpen ? (
                    <FriendsListSection
                      loading={loadingFriendProfiles}
                      profiles={friendProfiles}
                      onBack={handleCloseFriends}
                    />
                  ) : (
                    <>
                      <ProfileAboutCard
                        displayEmail={profileUser.email ?? "No email provided"}
                        selectedCountry={selectedCountry}
                        displayBirthday={
                          formatFirestoreDate(profileUser.birthday) ??
                          "Not specified"
                        }
                        displayJoinDate={
                          formatFirestoreDate(profileUser.joinDate) ??
                          "No date provided"
                        }
                        displayBiography={
                          profileUser.biography ?? "No biography provided."
                        }
                        displaySocialLinks={
                          profileUser.socialLinks &&
                          Object.keys(profileUser.socialLinks).length > 0
                            ? profileUser.socialLinks
                            : null
                        }
                      />
                      <VisitedCountriesCard
                        visitedCountryCodes={
                          profileUser.visitedCountryCodes || []
                        }
                      />
                      {bestScores.length > 0 && (
                        <BestScoresCard scores={bestScores} />
                      )}
                    </>
                  )}
                </>
              ) : (
                <div>User not found</div>
              )}
            </div>
          </div>
        </main>
      </div>
      {canEdit && (
        <EditProfileModal
          user={currentUser}
          profile={profileUser}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      )}
      <AppPanels />
    </>
  );
}
