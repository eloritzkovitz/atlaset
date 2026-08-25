import { useTranslation } from "react-i18next";
import { AppLinks } from "@app/layouts/app/footer/AppLinks";
import { DirectionalIcon } from "@components";
import { ICONS } from "@constants/icons";
import {
  getCompletedAchievementsCount,
  useGetAchievementsQuery,
} from "@features/achievements";
import { RecentActivitySection } from "@features/activity";
import { useCountryData } from "@features/countries";
import { useTrips } from "@features/trips";
import { useAuth } from "@features/user/auth";
import { useHomeCountry, useUserProfile } from "@features/user/profile";
import { useCountryTracking } from "@features/visits";
import { formatFraction } from "@utils";
import { StatsGrid } from "./StatsGrid";
import { UserOverviewCard } from "./UserOverviewCard";
import { useExplorationStats } from "../../explore/overview/hooks/useExplorationStats";

export function OverviewGrid() {
  const { user } = useAuth();
  const { countries, loading: countriesLoading } = useCountryData();
  const { isVisitedCountry } = useCountryTracking();
  const { totalCountries, visitedCountries } = useExplorationStats(countries);
  const { homeCountry, loading: homeCountryLoading } = useHomeCountry();
  const { trips } = useTrips();
  const { profile: userProfile, loading: userProfileLoading } = useUserProfile({
    uid: user?.uid,
  });
  const { t } = useTranslation("dashboard");

  const { data: achievements, isLoading: achievementsLoading } =
    useGetAchievementsQuery();
  const achievementsCount = achievements?.length ?? 0;
  const completedCount = homeCountryLoading
    ? 0
    : getCompletedAchievementsCount(
        achievements,
        countries,
        isVisitedCountry,
        trips,
        homeCountry,
      );

  const stats = [
    {
      label: t("overview.stats.countriesExplored", {
        defaultValue: "Countries Explored",
      }),
      value: countriesLoading
        ? "..."
        : formatFraction(visitedCountries, totalCountries),
      icon: <ICONS.exploration className="text-5xl text-info" />,
      link: "/explore/overview",
    },
    {
      label: t("overview.stats.achievements", { defaultValue: "Achievements" }),
      value:
        achievementsLoading || homeCountryLoading
          ? "..."
          : formatFraction(completedCount, achievementsCount),
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
