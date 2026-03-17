import React, { useState } from "react";
import { CountryListGroup, type Country } from "@features/countries";
import { AchievementIcon } from "./AchievementIcon";
import type { Achievement } from "../types";
import { getAchievementCountries } from "../utils/achievements";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";
import { useVisitedCountries } from "@features/visits/hooks/useVisitedCountries";

interface AchievementInfoProps {
  achievement: Achievement;
  countries: Country[];
  onBack?: () => void;
  onSelectCountry?: (isoCode: string) => void;
}

export const AchievementInfo: React.FC<AchievementInfoProps> = ({
  achievement,
  countries,
  onBack,
  onSelectCountry,
}) => {
  const [expandedCountries, setExpandedCountries] = useState(true);
  const achCountries = getAchievementCountries(achievement, countries);
  const isoCodes = achCountries.map((c) => c.isoCode);

  const { isCountryVisited } = useVisitedCountries();

  return (
    <section className="max-w-6xl mx-auto">
      <DashboardHeader
        title={achievement.name}
        leading={<AchievementIcon type={achievement.type} locked={false} />}
        onBack={onBack}
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
          onSelectCountry={onSelectCountry}
        />
      )}
    </section>
  );
};
