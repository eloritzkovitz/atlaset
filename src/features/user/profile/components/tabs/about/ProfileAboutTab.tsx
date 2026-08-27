import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCountryData } from "@features/countries";
import { useUserLeaderboardScores } from "@features/quizzes/leaderboards/hooks/useUserLeaderboardScores";
import { formatFirestoreDate } from "@utils";
import { BestScoresCard } from "./BestScoresCard";
import { ProfileAboutCard } from "./ProfileAboutCard";
import { ProfileTravelSummaryCard } from "./ProfileTravelSummaryCard";
import type { UserProfile } from "../../../types";

interface ProfileAboutTabProps {
  profileUser: UserProfile;
  canEdit: boolean;
}

export function ProfileAboutTab({
  profileUser,
  canEdit,
}: ProfileAboutTabProps) {
  const { t } = useTranslation("user");

  // Get the selected country based on the user's home country code
  const { countryByIsoCode } = useCountryData();
  const selectedCountry = profileUser.homeCountry
    ? (countryByIsoCode[profileUser.homeCountry] ?? null)
    : null;

  const allVisitedCountryCodes = useMemo(() => {
    const manual = profileUser.manualVisitedCountryCodes || [];
    const tripBased = profileUser.visitedCountryCodes || [];
    return Array.from(new Set([...manual, ...tripBased]));
  }, [profileUser]);

  // Quiz Leaderboard Scores
  const bestScores = useUserLeaderboardScores(profileUser.uid);

  return (
    <div className="space-y-6">
      <ProfileAboutCard
        displayEmail={
          canEdit
            ? (profileUser.email ??
              t("profile.about.personalDetails.noEmailProvided"))
            : null
        }
        selectedCountry={selectedCountry}
        displayBirthday={
          formatFirestoreDate(profileUser.birthday) ??
          t("profile.about.notSpecified")
        }
        displayJoinDate={
          formatFirestoreDate(profileUser.joinDate) ??
          t("profile.about.notSpecified")
        }
        displayBiography={
          profileUser.biography ?? t("profile.about.notSpecified")
        }
        displaySocialLinks={
          profileUser.socialLinks &&
          Object.keys(profileUser.socialLinks).length > 0
            ? profileUser.socialLinks
            : null
        }
      />

      <ProfileTravelSummaryCard
        username={profileUser.username}
        visitedCountryCodes={allVisitedCountryCodes}
        wantToVisitCountryCodes={profileUser.wantToVisitCountryCodes ?? []}
      />

      {bestScores.length > 0 && <BestScoresCard scores={bestScores} />}
    </div>
  );
}
