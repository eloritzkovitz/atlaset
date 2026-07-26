import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useCountryData } from "@features/countries";
import { useUserLeaderboardScores } from "@features/quizzes";
import {
  useUserFriendCount,
  useFriendProfiles,
  useUserFriends,
} from "@features/user/friends";
import {
  BestScoresCard,
  EditProfileModal,
  FriendsListSection,
  ProfileAboutCard,
  ProfileCountriesCard,
  ProfileHeader,
  useUserProfile,
} from "@features/user/profile";
import { usePageTitle } from "@hooks";
import { AppPanels } from "@layouts/shells/AppPanels";
import { formatFirestoreDate } from "@utils/date";

export default function ProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useParams();
  const { t } = useTranslation("user");
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);
  const { profile: profileUser, loading: profileLoading } = useUserProfile({
    username,
    refreshKey: profileRefreshKey,
  });
  const [editOpen, setEditOpen] = useState(false);
  const friendsOpen = location.pathname.endsWith("/friends");
  const bestScores = useUserLeaderboardScores(profileUser?.uid);

  // Set the page title to the profile user's displayName if available
  usePageTitle(
    profileUser && profileUser.displayName
      ? `${profileUser.displayName}`
      : "Profile",
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

  // When opening the modal, just navigate
  const handleOpenFriends = () => {
    if (!profileUser?.uid) return;
    navigate(`/users/${profileUser.username}/friends`, { replace: false });
  };

  // Handle closing the modal by navigating back to the main profile route
  const handleCloseFriends = () => {
    navigate(`/users/${profileUser?.username}`);
  };

  // Show loading state while fetching auth and profile data
  if (!profileUser && !(authLoading || profileLoading))
    return <div>User not found</div>;

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <main className="flex-1 p-4 md:p-8 overflow-auto min-h-0 mt-12">
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
                      displayEmail={
                        profileUser.email ??
                        t("profile.about.personalDetails.noEmailProvided")
                      }
                      selectedCountry={selectedCountry}
                      displayBirthday={
                        formatFirestoreDate(profileUser.birthday) ??
                        t("profile.about.personalDetails.notSpecified")
                      }
                      displayJoinDate={
                        formatFirestoreDate(profileUser.joinDate) ??
                        t("profile.about.personalDetails.notSpecified")
                      }
                      displayBiography={
                        profileUser.biography ??
                        t("profile.about.personalDetails.noBiographyProvided")
                      }
                      displaySocialLinks={
                        profileUser.socialLinks &&
                        Object.keys(profileUser.socialLinks).length > 0
                          ? profileUser.socialLinks
                          : null
                      }
                    />
                    <ProfileCountriesCard
                      countryCodes={profileUser.visitedCountryCodes || []}
                      type="visited"
                    />
                    <ProfileCountriesCard
                      countryCodes={profileUser.wantToVisitCountryCodes || []}
                      type="wantToVisit"
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
      {canEdit && (
        <EditProfileModal
          user={currentUser}
          profile={profileUser}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={() => setProfileRefreshKey((k) => k + 1)}
        />
      )}
      <AppPanels />
    </>
  );
}
