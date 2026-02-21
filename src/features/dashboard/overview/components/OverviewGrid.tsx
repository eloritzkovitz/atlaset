import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import { useAuth, useHomeCountry, useUserProfile } from "@features/user";
import { RecentActivitySection } from "@features/user/activity/components/RecentActivitySection";
import { useVisitedCountries } from "@features/visits";
import { AppLinks } from "@layout";
import { StatsGrid } from "./StatsGrid";
import { UserOverviewCard } from "./UserOverviewCard";
import { getStatsConfig } from "../config/stats";
import { useAchievementsData } from "../../achievements/hooks/useAchievementsData";
import { isCompleted } from "../../achievements/utils/achievements";
import { useExplorationStats } from "../../exploration/hooks/useExplorationStats";

export function OverviewGrid() {
  const { user } = useAuth();
  const { profile: userProfile, loading: userProfileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const { countries, loading: countriesLoading } = useCountryData();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  // Get visited countries and exploration stats
  const visited = useVisitedCountries();
  const { totalCountries, visitedCountries } = useExplorationStats(
    countries,
  );

  // Get achievements data and calculate completed achievements
  const { achievementsData, loading: achievementsLoading } =
    useAchievementsData();
  const achievementsCount = achievementsData?.length ?? 0;
  const completedCount =
    achievementsData?.filter((a) =>
      isCompleted(a, countries, visited, trips, homeCountry),
    ).length ?? 0;

  // Use extracted stats config
  const stats = getStatsConfig({
    countriesLoading,
    visitedCountries,
    totalCountries,
    achievementsLoading,
    completedCount,
    achievementsCount,
  });

  // Extract first name for personalized heading
  const firstName =
    userProfile?.displayName?.split(" ")[0] ?? userProfile?.username ?? "User";

  return (
    <div className="mt-8">
      {userProfile && !userProfileLoading && (
        <UserOverviewCard
          userProfile={userProfile}
          user={user}
          loading={userProfileLoading}
        />
      )}
      <h2 className="text-3xl font-bold mb-6">{firstName}&apos;s Overview</h2>
      <StatsGrid stats={stats} />
      <RecentActivitySection />
      <AppLinks className="mb-10 mt-6 text-sm font-semibold" />
    </div>
  );
}
