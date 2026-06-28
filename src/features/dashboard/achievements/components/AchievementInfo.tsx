import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ViewModeSegmentedControl } from "@components";
import { CountryFlagGrid, CountryListGroup } from "@features/countries";
import { useViewMode } from "@hooks";
import { AchievementListGroup } from "./AchievementListGroup";
import { useVisitedCountries } from "@features/visits";
import { AchievementIcon } from "./AchievementIcon";
import { useAchievementStatus } from "../hooks/useAchievementStatus";
import type { Achievement } from "../types";
import { getAchievementCountries } from "../utils/achievements";
import { getCurrentTier } from "../utils/achievementsTiers";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";
import { getCountryRoute } from "../../navigation/utils/dashboardNavigation";

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

  const { viewMode, setViewMode } = useViewMode("list");
  const [expandedCountries, setExpandedCountries] = useState(true);

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

  // Defensive check for achievement existence
  if (!achievement) return <div className="p-4">Achievement not found.</div>;

  // Defensive check for criteria countries
  const isoCodes = achCountries.map((c) => c.isoCode);
  const groupLabel = region ? `Countries in ${region}` : "Countries";

  return (
    <section className="max-w-6xl mx-auto px-4">
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

      {isoCodes.length > 0 && (
        <div className="mt-2 pt-6 items-end">
          <div className="flex justify-end mb-4">
            <ViewModeSegmentedControl
              viewMode={viewMode}
              onChange={setViewMode}
            />
          </div>

          {viewMode === "list" ? (
            <CountryListGroup
              label={groupLabel}
              isoCodes={isoCodes}
              countries={countries}
              visited={isVisitedCountry}
              expanded={expandedCountries}
              onToggle={() => setExpandedCountries((prev) => !prev)}
              onSelectCountry={handleCountrySelect}
            />
          ) : (
            <CountryFlagGrid
              countryCodes={isoCodes}
              size="64"
              isHighlighted={(code) => isVisitedCountry(code)}
              onCountryClick={handleCountrySelect}
            />
          )}
        </div>
      )}
    </section>
  );
}
