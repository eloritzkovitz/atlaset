import { useTranslation } from "react-i18next";
import { AppLinks, DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import { RecentActivitySection } from "@features/activity";
import { useCountryData } from "@features/countries";
import { useAuth } from "@features/user/auth";
import { useHomeCountry, useUserProfile } from "@features/user/profile";
import { useVisitedCountries } from "@features/visits";
import { useAnimatedNumber } from "@hooks";
import { formatFraction } from "@utils";
import { StatsGrid } from "./StatsGrid";
import { UserOverviewCard } from "./UserOverviewCard";
import { useGetAchievementsQuery } from "../../achievements/api/achievementsApi";
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
  const { t } = useTranslation("dashboard");

  // Get visited countries and exploration stats
  const visited = useVisitedCountries();
  const { totalCountries, visitedCountries } = useExplorationStats(countries);

  // Get achievements data and calculate completed achievements
  const { data: achievements, isLoading: achievementsLoading } =
    useGetAchievementsQuery();
  const achievementsCount = achievements?.length ?? 0;
  const completedCount =
    achievements?.filter((a) =>
      isCompleted(a, countries, visited, trips, homeCountry),
    ).length ?? 0;

  const animatedVisitedCountries = useAnimatedNumber(visitedCountries, 30);
  const animatedCompletedCount = useAnimatedNumber(completedCount, 30);

  const stats = [
    {
      label: t("overview.stats.countriesExplored", {
        defaultValue: "Countries Explored",
      }),
      value: countriesLoading
        ? "..."
        : formatFraction(animatedVisitedCountries, totalCountries),
      icon: <ICONS.exploration className="text-5xl text-info" />,
      link: "/dashboard/exploration",
    },
    {
      label: t("overview.stats.achievements", { defaultValue: "Achievements" }),
      value: achievementsLoading
        ? "..."
        : formatFraction(animatedCompletedCount, achievementsCount),
      icon: <ICONS.achievements className="text-5xl text-warning" />,
      link: "/dashboard/achievements",
    },
    {
      label: t("overview.stats.statistics", { defaultValue: "Statistics" }),
      value: (
        <span className="flex items-center gap-2">
          {t("overview.stats.view", { defaultValue: "View" })}
          <DirectionalIcon
            variant="chevron"
            direction="next"
            className="inline-block"
          />
        </span>
      ),
      icon: <ICONS.statistics className="text-5xl text-success" />,
      link: "/dashboard/statistics",
    },
  ];
  const firstName =
    userProfile?.displayName?.split(" ")[0] ??
    userProfile?.username ??
    t("overview.user", { defaultValue: "User" });

  return (
    <div className="mt-8">
      <UserOverviewCard
        userProfile={userProfile}
        user={user}
        loading={userProfileLoading}
      />
      <h2 className="text-3xl font-bold mb-6">
        {t("overview.stats.heading", {
          name: firstName,
          defaultValue: `${firstName}'s Overview`,
        })}
      </h2>
      <StatsGrid stats={stats} />
      <RecentActivitySection />
      <AppLinks className="mb-10 mt-6 text-sm font-semibold" />
    </div>
  );
}
