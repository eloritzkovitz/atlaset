import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, ViewModeSegmentedControl } from "@components";
import { CountryFlagGrid, CountryListGroup } from "@features/countries";
import { useViewMode } from "@hooks";
import { ExploreHeader } from "./ExploreHeader";

export interface IsoGroups {
  sovereignIsoCodes: string[];
  dependencyIsoCodes: string[];
}

export interface CountryGroupSection {
  id?: string;
  isoGroups: IsoGroups;
  primaryLabel?: React.ReactNode;
  dependencyLabel?: React.ReactNode;
  primaryLabelKey?: string;
  dependencyLabelKey?: string;
}

interface InfoWithCountryGroupsProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showHeader?: boolean;
  actions?: React.ReactNode;
  groups: CountryGroupSection[];
  labelArgs?: Record<string, unknown>;
  onSelectCountry?: (iso: string) => void;
  visited?: (iso: string) => boolean;
}

export const InfoWithCountryGroups: React.FC<InfoWithCountryGroupsProps> = ({
  title,
  subtitle,
  onBack,
  showHeader = true,
  actions,
  groups,
  labelArgs,
  onSelectCountry,
  visited,
}) => {
  const { t } = useTranslation("explore");
  const { viewMode, setViewMode } = useViewMode("list");

  // Track expanded/collapsed state per group using section index keys
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>(
    {},
  );

  const isExpanded = (key: string) => expandedStates[key] ?? true;

  // Toggle the expanded/collapsed state for a specific group
  const toggleExpanded = (key: string) => {
    setExpandedStates((prev) => ({
      ...prev,
      [key]: !isExpanded(key),
    }));
  };

  // Determine if any groups have countries to display
  const hasAnyGroups = groups.some(
    (g) =>
      g.isoGroups.sovereignIsoCodes.length > 0 ||
      g.isoGroups.dependencyIsoCodes.length > 0,
  );

  const shouldRenderGrid = viewMode === "grid";

  // Renders a group of countries based on the view mode
  const renderGroup = (
    label: React.ReactNode,
    isoCodes: string[],
    expanded: boolean,
    onToggle: () => void,
  ) => {
    if (!isoCodes || isoCodes.length === 0 || !label) return null;

    if (!shouldRenderGrid) {
      return (
        <CountryListGroup
          label={label}
          isoCodes={isoCodes}
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
        <ExploreHeader
          title={title}
          subtitle={subtitle}
          actions={actions}
          onBack={onBack}
        />
      )}
      {hasAnyGroups && (
        <div className="flex justify-end mb-4">
          <ViewModeSegmentedControl
            viewMode={viewMode}
            onChange={setViewMode}
          />
        </div>
      )}

      {groups.map((section, idx) => {
        const primaryKey = `section-${idx}-primary`;
        const depKey = `section-${idx}-dependency`;

        const resolvedPrimaryLabel =
          section.primaryLabel ??
          (section.primaryLabelKey
            ? String(t(section.primaryLabelKey, { ...labelArgs }))
            : String(t("menu.countries", { ...labelArgs })));

        const resolvedDependencyLabel =
          section.dependencyLabel ??
          (section.dependencyLabelKey
            ? String(t(section.dependencyLabelKey, { ...labelArgs }))
            : String(t("menu.countries", { ...labelArgs })));

        return (
          <React.Fragment key={section.id ?? `section-${idx}`}>
            {renderGroup(
              resolvedPrimaryLabel,
              section.isoGroups.sovereignIsoCodes,
              isExpanded(primaryKey),
              () => toggleExpanded(primaryKey),
            )}

            {renderGroup(
              resolvedDependencyLabel,
              section.isoGroups.dependencyIsoCodes,
              isExpanded(depKey),
              () => toggleExpanded(depKey),
            )}
          </React.Fragment>
        );
      })}
    </section>
  );
};
