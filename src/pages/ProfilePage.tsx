import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useUserLeaderboardScores } from "@features/quizzes";
import {
  BestScoresCard,
  EditProfileModal,
  ProfileHeader,
  VisitedCountriesCard,
  useUserProfile,
} from "@features/user";
import { usePageTitle } from "@hooks";
import { Footer, Header } from "@layout";
import { ProfileAboutCard } from "@features/user/profile/components/ProfileAboutCard";
import { useCountryData } from "@features/countries";
import { formatFirestoreDate } from "@utils/date";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const { profile: profileUser, loading: profileLoading } = useUserProfile({
    username,
  });
  const [editOpen, setEditOpen] = useState(false);
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

  // Handle case where user not found
  if (!profileUser && !(authLoading || profileLoading))
    return <div>User not found</div>;

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
                  />
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
                    visitedCountryCodes={profileUser.visitedCountryCodes || []}
                  />
                  {bestScores.length > 0 && (
                    <BestScoresCard scores={bestScores} />
                  )}
                </>
              ) : (
                <div>User not found</div>
              )}
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
