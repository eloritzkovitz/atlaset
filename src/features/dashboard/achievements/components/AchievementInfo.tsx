import { useState } from "react";
import { CountryListGroup, type Country } from "@features/countries";
import { useVisitedCountries } from "@features/visits";
import { AchievementIcon } from "./AchievementIcon";
import type { Achievement } from "../types";
import { getAchievementCountries } from "../utils/achievements";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
import { useDashboardNavigation } from "../../navigation/hooks/useDashboardNavigation";

interface AchievementInfoProps {
  achievement: Achievement;
  countries: Country[];
}

export function AchievementInfo({
  achievement,
  countries,
}: AchievementInfoProps) {
  const [expandedCountries, setExpandedCountries] = useState(true);
  const achCountries = getAchievementCountries(achievement, countries);
  const { isCountryVisited } = useVisitedCountries();
  const { handleCountrySelect, handleBack } = useDashboardNavigation(
    countries,
    "",
    "",
  );

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
      {isoCodes.length > 0 && (
        <CountryListGroup
          label="Countries"
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
