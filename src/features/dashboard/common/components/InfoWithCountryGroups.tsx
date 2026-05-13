import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CountryListGroup, type Country } from "@features/countries";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";

interface IsoGroups {
  sovereignIsoCodes: string[];
  dependencyIsoCodes: string[];
}

interface InfoWithCountryGroupsProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  isoGroups: IsoGroups;
  countries: Country[];
  primaryLabelKey: string;
  dependencyLabelKey: string;
  labelArgs?: Record<string, unknown>;
  onSelectCountry?: (iso: string) => void;
}

export const InfoWithCountryGroups: React.FC<InfoWithCountryGroupsProps> = ({
  title,
  subtitle,
  onBack,
  isoGroups,
  countries,
  primaryLabelKey,
  dependencyLabelKey,
  labelArgs,
  onSelectCountry,
}) => {
  const { t } = useTranslation("dashboard");
  const [expandedSovereign, setExpandedSovereign] = useState(true);
  const [expandedDependencies, setExpandedDependencies] = useState(true);

  return (
    <section className="max-w-6xl mx-auto">
      <DashboardHeader title={title} subtitle={subtitle} onBack={onBack} />
      {isoGroups.sovereignIsoCodes.length > 0 && (
        <CountryListGroup
          label={String(t(primaryLabelKey, { ...labelArgs }))}
          isoCodes={isoGroups.sovereignIsoCodes}
          countries={countries}
          expanded={expandedSovereign}
          onToggle={() => setExpandedSovereign((p) => !p)}
          onSelectCountry={onSelectCountry}
        />
      )}
      {isoGroups.dependencyIsoCodes.length > 0 && (
        <CountryListGroup
          label={String(t(dependencyLabelKey, { ...labelArgs }))}
          isoCodes={isoGroups.dependencyIsoCodes}
          countries={countries}
          expanded={expandedDependencies}
          onToggle={() => setExpandedDependencies((p) => !p)}
          onSelectCountry={onSelectCountry}
        />
      )}
    </section>
  );
};
