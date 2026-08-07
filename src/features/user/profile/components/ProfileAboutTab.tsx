import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCountryData } from "@features/countries";
import { useUserLeaderboardScores } from "@features/quizzes/leaderboards/hooks/useUserLeaderboardScores";
import { formatFirestoreDate } from "@utils";
import { ProfileAboutCard } from "./ProfileAboutCard";
import { ProfileCountriesCard } from "./ProfileCountriesCard";
import { BestScoresCard } from "./BestScoresCard";
import type { UserProfile } from "../types";

interface ProfileAboutTabProps {
  profileUser: UserProfile;
  canEdit: boolean;
}

export function ProfileAboutTab({
  profileUser,
  canEdit,
}: ProfileAboutTabProps) {
  const { t } = useTranslation("user");

  // Country Data & Visited Codes Calculation
  const { countries } = useCountryData();
  const selectedCountry = useMemo(
    () => countries.find((c) => c.isoCode === profileUser.homeCountry) ?? null,
    [countries, profileUser.homeCountry],
  );

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

      <ProfileCountriesCard
        countryCodes={allVisitedCountryCodes}
        type="visited"
      />

      <ProfileCountriesCard
        countryCodes={profileUser.wantToVisitCountryCodes || []}
        type="wantToVisit"
      />

      {bestScores.length > 0 && <BestScoresCard scores={bestScores} />}
    </div>
  );
}
