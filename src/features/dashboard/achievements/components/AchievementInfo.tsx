import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@components";
import { useVisitedCountries } from "@features/visits";
import { AchievementIcon } from "./AchievementIcon";
import { AchievementListGroup } from "./AchievementListGroup";
import { useAchievementStatus } from "../hooks/useAchievementStatus";
import type { Achievement } from "../types";
import { getAchievementCountries } from "../utils/achievementFilters";
import { getCurrentTier } from "../utils/achievementsTiers";
import { DashboardHeader } from "../../core/components/DashboardHeader";
import { InfoWithCountryGroups } from "../../core/components/InfoWithCountryGroups";
import { useDashboardNavigation } from "../../core/hooks/useDashboardNavigation";
import { useIsoGroups } from "../../core/hooks/useIsoGroups";
import { getCountryRoute } from "../../core/utils/dashboardNavigation";

export function AchievementInfo() {
  const { achievementId } = useParams();
  const { mergedAchievements, achievementStatusMap, countries } =
    useAchievementStatus();
  const achievement = mergedAchievements.find(
    (a) => String(a.id) === achievementId,
  );
  const { isVisitedCountry } = useVisitedCountries();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );
  const navigate = useNavigate();

  let achCountries: typeof countries = [];
  let region: string | undefined;

  // Determine display criteria and derive countries
  if (achievement) {
    const { tierObj } = getCurrentTier(
      achievement,
      countries,
      { isVisitedCountry },
      undefined,
      undefined,
    );
    const displayCriteria =
      (tierObj && tierObj.criteria) || achievement.criteria || {};

    // Prefer `regions` array; take the first entry if present
    region =
      Array.isArray(displayCriteria?.regions) && displayCriteria.regions!.length
        ? displayCriteria.regions![0]
        : undefined;

    if (region) {
      achCountries = countries.filter((c) => c.region === region);
    } else {
      const achForDisplay: Achievement = {
        ...achievement,
        criteria: displayCriteria,
      };
      achCountries = getAchievementCountries(achForDisplay, countries);
    }
  }

  const isoGroups = useIsoGroups(achCountries, () => true);
  const hasCountries =
    isoGroups.sovereignIsoCodes.length > 0 ||
    isoGroups.dependencyIsoCodes.length > 0;

  // Defensive check for achievement existence
  if (!achievement) return <div className="p-4">Achievement not found.</div>;

  const primaryGroupLabel = region
    ? `Sovereign countries in ${region}`
    : "Sovereign countries";
  const dependencyGroupLabel = region
    ? `Dependencies and territories in ${region}`
    : "Dependencies and territories";

  return (
    <Container>
      <DashboardHeader
        title={achievement.name}
        leading={<AchievementIcon type={achievement.type} locked={false} />}
        onBack={handleBack}
      />
      <div className="mb-4 text-muted text-base">{achievement.description}</div>

      {achievement.requires && achievement.requires.length > 0 && (
        <AchievementListGroup
          achievements={
            achievement.requires
              .map((reqId) =>
                mergedAchievements.find((a) => String(a.id) === String(reqId)),
              )
              .filter(Boolean) as Achievement[]
          }
          label="Required Achievements"
          achievementStatusMap={achievementStatusMap}
        />
      )}

      {achievement.criteria?.regions &&
        Array.isArray(achievement.criteria.regions) && (
          <AchievementListGroup
            achievements={
              achievement.criteria.regions.map((region) => ({
                id: region,
                name: region,
                type: "region",
                description: `Visit at least one country in ${region}`,
              })) as Achievement[]
            }
            label="Regions"
            achievementStatusMap={Object.fromEntries(
              achievement.criteria.regions.map((region) => [
                region,
                countries.some(
                  (c) => c.region === region && isVisitedCountry(c.isoCode),
                ),
              ]),
            )}
            onAchievementClick={(region) => {
              navigate(getCountryRoute(region));
            }}
          />
        )}

      {hasCountries && (
        <div className="mt-2 pt-6 items-end">
          <InfoWithCountryGroups
            title={achievement.name}
            showHeader={false}
            countries={countries}
            onSelectCountry={handleCountrySelect}
            visited={isVisitedCountry}
            groups={[
              {
                isoGroups,
                primaryLabel: primaryGroupLabel,
                dependencyLabel: dependencyGroupLabel,
              },
            ]}
          />
        </div>
      )}
    </Container>
  );
}
