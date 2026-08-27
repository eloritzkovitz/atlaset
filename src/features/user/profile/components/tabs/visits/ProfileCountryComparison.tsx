import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import {
  ActionButton,
  Card,
  DirectionalIcon,
  EmptyListMessage,
  LoadingSpinner,
  TabButton,
} from "@components";
import { CountryFlagGrid } from "@features/countries";
import { useAuth } from "@features/user/auth";
import { ProfileComparisonStat } from "./ProfileComparisonStat";
import { useUserProfile } from "../../../hooks/useUserProfile";
import {
  compareCountryTracking,
  getAllVisitedCountryCodes,
} from "../../../utils/countryTracking";

type ComparisonFilter = "shared" | "currentUser" | "otherUser";

export function ProfileCountryComparison() {
  const { t } = useTranslation("user");
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const { profile: myProfile, loading: myProfileLoading } = useUserProfile({
    uid: currentUser?.uid,
  });

  const { profile: otherUser, loading: profileLoading } = useUserProfile({
    username,
  });

  const activeFilter: ComparisonFilter =
    searchParams.get("filter") === "currentUser"
      ? "currentUser"
      : searchParams.get("filter") === "otherUser"
        ? "otherUser"
        : "shared";

  const profileFirstName = otherUser?.displayName?.trim().split(/\s+/)[0] ?? "";

  const currentUserVisitedCountryCodes = useMemo(
    () => (myProfile ? getAllVisitedCountryCodes(myProfile) : []),
    [myProfile],
  );

  const otherUserVisitedCountryCodes = useMemo(
    () => (otherUser ? getAllVisitedCountryCodes(otherUser) : []),
    [otherUser],
  );

  const comparison = useMemo(() => {
    if (!myProfile || !otherUser) {
      return null;
    }

    return compareCountryTracking(
      currentUserVisitedCountryCodes,
      otherUserVisitedCountryCodes,
      myProfile.wantToVisitCountryCodes ?? [],
      otherUser.wantToVisitCountryCodes ?? [],
    );
  }, [
    myProfile,
    otherUser,
    currentUserVisitedCountryCodes,
    otherUserVisitedCountryCodes,
  ]);

  const handleFilterChange = (filter: ComparisonFilter) => {
    if (filter === "shared") {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", filter);
    }

    setSearchParams(searchParams, { replace: true });
  };

  const isLoading = myProfileLoading || profileLoading;

  if (isLoading) {
    return (
      <LoadingSpinner
        message={t("profile.visits.compare.loading", "Comparing...")}
      />
    );
  }

  if (!myProfile || !otherUser || !comparison) {
    return null;
  }

  const currentUserVisitedCount = currentUserVisitedCountryCodes.length;
  const otherUserVisitedCount = otherUserVisitedCountryCodes.length;
  const countryCodes = comparison.visited[activeFilter];

  return (
    <div className="space-y-6">
      <Card
        title={t("profile.visits.compare.title", "Comparing with {{name}}", {
          name: profileFirstName,
        })}
        actions={
          <ActionButton
            onClick={() => window.history.back()}
            icon={<DirectionalIcon direction="prev" variant="arrow" />}
            title={t("common.return", "Return")}
            rounded
          />
        }
      >
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <ProfileComparisonStat
            user={myProfile}
            count={currentUserVisitedCount}
            label={t("profile.visits.compare.youVisited", "You visited")}
            isWinner={currentUserVisitedCount > otherUserVisitedCount}
          />

          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">
              {comparison.visited.shared.length}
            </div>

            <div className="mt-2 text-muted">
              {t("profile.visits.compare.inCommon", "In common")}
            </div>
          </div>

          <ProfileComparisonStat
            user={otherUser}
            count={otherUserVisitedCount}
            label={t("profile.visits.compare.theyVisited", "{{name}} visited", {
              name: profileFirstName,
            })}
            isWinner={otherUserVisitedCount > currentUserVisitedCount}
          />
        </div>

        <div className="flex gap-2 mt-8">
          <TabButton
            active={activeFilter === "shared"}
            onClick={() => handleFilterChange("shared")}
          >
            {t("profile.visits.compare.filters.both", "Both")} (
            {comparison.visited.shared.length})
          </TabButton>

          <TabButton
            active={activeFilter === "currentUser"}
            onClick={() => handleFilterChange("currentUser")}
          >
            {t("profile.visits.compare.filters.currentUser", "Only me")} (
            {comparison.visited.currentUser.length})
          </TabButton>

          <TabButton
            active={activeFilter === "otherUser"}
            onClick={() => handleFilterChange("otherUser")}
          >
            {t("profile.visits.compare.filters.otherUser", "Only {{name}}", {
              name: profileFirstName,
            })}{" "}
            ({comparison.visited.otherUser.length})
          </TabButton>
        </div>

        <div className="mt-8">
          {countryCodes.length === 0 ? (
            <EmptyListMessage
              message={t("profile.visits.noCountries", "No countries found.")}
            />
          ) : (
            <CountryFlagGrid countryCodes={countryCodes} size="64" />
          )}
        </div>
      </Card>
    </div>
  );
}
