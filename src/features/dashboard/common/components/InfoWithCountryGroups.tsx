import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, ViewModeSegmentedControl } from "@components";
import {
  CountryFlagGrid,
  CountryListGroup,
  type Country,
} from "@features/countries";
import { useViewMode } from "@hooks";
import { DashboardHeader } from "../../navigation/components/DashboardHeader";

interface IsoGroups {
  sovereignIsoCodes: string[];
  dependencyIsoCodes: string[];
}

interface InfoWithCountryGroupsProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showHeader?: boolean;
  isoGroups: IsoGroups;
  countries: Country[];
  primaryLabel?: React.ReactNode;
  dependencyLabel?: React.ReactNode;
  primaryLabelKey?: string;
  dependencyLabelKey?: string;
  labelArgs?: Record<string, unknown>;
  onSelectCountry?: (iso: string) => void;
  visited?: (iso: string) => boolean;
}

export const InfoWithCountryGroups: React.FC<InfoWithCountryGroupsProps> = ({
  title,
  subtitle,
  onBack,
  showHeader = true,
  isoGroups,
  countries,
  primaryLabel,
  dependencyLabel,
  primaryLabelKey,
  dependencyLabelKey,
  labelArgs,
  onSelectCountry,
  visited,
}) => {
  const { t } = useTranslation("dashboard");
  const [expandedSovereign, setExpandedSovereign] = useState(true);
  const [expandedDependencies, setExpandedDependencies] = useState(true);
  const { viewMode, setViewMode } = useViewMode("list");

  const hasAnyGroups =
    isoGroups.sovereignIsoCodes.length > 0 ||
    isoGroups.dependencyIsoCodes.length > 0;
  const shouldRenderGrid = viewMode === "grid";
  const resolvedPrimaryLabel =
    primaryLabel ??
    String(
      t(primaryLabelKey ?? "menu.countries", {
        ...labelArgs,
      }),
    );
  const resolvedDependencyLabel =
    dependencyLabel ??
    String(
      t(dependencyLabelKey ?? "menu.countries", {
        ...labelArgs,
      }),
    );

  const renderGroup = (
    label: React.ReactNode,
    isoCodes: string[],
    expanded: boolean,
    onToggle: () => void,
  ) => {
    if (isoCodes.length === 0) return null;

    if (!shouldRenderGrid) {
      return (
        <CountryListGroup
          label={label}
          isoCodes={isoCodes}
          countries={countries}
          visited={visited}
          expanded={expanded}
          onToggle={onToggle}
          onSelectCountry={onSelectCountry}
        />
      );
    }

    return (
      <CollapsibleHeader
        label={label}
        count={isoCodes.length}
        expanded={expanded}
        icon={undefined}
        onToggle={onToggle}
      >
        <CountryFlagGrid
          countryCodes={isoCodes}
          size="64"
          isHighlighted={visited}
          onCountryClick={onSelectCountry}
        />
      </CollapsibleHeader>
    );
  };

  return (
    <section>
      {showHeader && (
        <DashboardHeader title={title} subtitle={subtitle} onBack={onBack} />
      )}
      {hasAnyGroups && (
        <div className="flex justify-end mb-4">
          <ViewModeSegmentedControl
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>
      )}

      {renderGroup(
        resolvedPrimaryLabel,
        isoGroups.sovereignIsoCodes,
        expandedSovereign,
        () => setExpandedSovereign((p) => !p),
      )}

      {renderGroup(
        resolvedDependencyLabel,
        isoGroups.dependencyIsoCodes,
        expandedDependencies,
        () => setExpandedDependencies((p) => !p),
      )}
    </section>
  );
};
