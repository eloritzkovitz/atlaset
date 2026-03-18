import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAchievementStatus } from "../hooks/useAchievementStatus";
import { CountryListGroup } from "@features/countries";
import { AchievementListGroup } from "./AchievementListGroup";
import { useVisitedCountries } from "@features/visits";
import { AchievementIcon } from "./AchievementIcon";
import type { Achievement } from "../types";
import { getAchievementCountries } from "../utils/achievements";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";

export function AchievementInfo() {
  const { achievementId } = useParams();
  const { mergedAchievements, achievementStatusMap, countries } =
    useAchievementStatus();
  const achievement = mergedAchievements.find(
    (a) => String(a.id) === achievementId,
  );
  const { isCountryVisited } = useVisitedCountries();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );

  const [expandedCountries, setExpandedCountries] = useState(true);
  let achCountries: typeof countries = [];

  // First try to get region from achievement criteria or tiers, then fallback to achievement countries
  if (achievement) {
    // Find region from any tier
    let region = achievement.criteria?.region;
    if (!region && achievement.tiers && achievement.tiers.length) {
      region = achievement.tiers.find((t) => t.criteria?.region)?.criteria
        ?.region;
    }
    if (region) {
      achCountries = countries.filter((c) => c.region === region);
    } else {
      achCountries = getAchievementCountries(achievement, countries);
    }
  }

  // Defensive check for achievement existence
  if (!achievement) return <div className="p-4">Achievement not found.</div>;

  // Defensive check for criteria countries
  const isoCodes = achCountries.map((c) => c.isoCode);

  return (
    <section className="max-w-6xl mx-auto">
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
                  (c) => c.region === region && isCountryVisited(c.isoCode),
                ),
              ]),
            )}
            onAchievementClick={(region) => {
              window.location.href = `/dashboard/countries/${encodeURIComponent(region)}`;
            }}
          />
        )}
      {isoCodes.length > 0 && (
        <CountryListGroup
          label={
            achievement.criteria?.region
              ? `Countries in ${achievement.criteria.region}`
              : "Countries"
          }
          isoCodes={isoCodes}
          countries={countries}
          visited={isCountryVisited}
          expanded={expandedCountries}
          onToggle={() => setExpandedCountries((prev) => !prev)}
          onSelectCountry={handleCountrySelect}
        />
      )}
    </section>
  );
}
