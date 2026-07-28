import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH, DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useTimeline } from "@features/atlas/timeline";
import { type Country } from "@features/countries";
import {
  getAllGeoTypes,
  getAllSovereigntyStatuses,
} from "@features/countries/utils/countryData";
import { useAccessibility, useLanguage } from "@features/settings";
import { useKeyHandler, useScreenSize } from "@hooks";
import { CoreFilters } from "./CoreFilters";
import { LayerFilters } from "./LayerFilters";
import { TimelineFilters } from "./TimelineFilters";
import { useCountryFilters } from "../../context/CountryFiltersContext";
import { useRegionSubregionSelection } from "../../hooks/useRegionSubregionSelection";

interface CountryFiltersPanelProps {
  countries: Country[];
  allRegions: string[];
  allSubregions: string[];
  subregionsByRegion: Record<string, string[]>;
  subregionToRegion: Map<string, string>;
  show: boolean;
  onHide: () => void;
  resetFilters: () => void;
}

export function CountryFiltersPanel({
  countries,
  allRegions,
  allSubregions,
  subregionsByRegion,
  subregionToRegion,
  show,
  onHide,
  resetFilters,
}: CountryFiltersPanelProps) {
  const { animationsEnabled, singleKeyShortcutsEnabled } = useAccessibility();
  const {
    selectedRegion,
    selectedSubregion,
    setSelectedRegion,
    visitedOnly,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
  } = useCountryFilters();
  const { timelineMode } = useTimeline();
  const { t } = useTranslation("atlas");

  // Effective layers check to determine if Layer Filters section should exist
  const effectiveLayers = useEffectiveLayers();
  const visibleLayers = effectiveLayers?.filter((layer) => layer.visible) ?? [];
  const hasVisibleLayers = visibleLayers.length > 0;

  // Collapsible state for filter groups
  const [showCoreFilters, setShowCoreFilters] = React.useState(true);
  const [showLayerFilters, setShowLayerFilters] = React.useState(true);
  const [showTimelineFilters, setShowTimelineFilters] = React.useState(true);

  // Subregion options based on selected region
  const { subregionOptions } = useRegionSubregionSelection(
    allSubregions,
    subregionsByRegion,
    selectedRegion,
    selectedSubregion,
    setSelectedRegion,
  );

  // All sovereignty statuses from country data
  const geoTypeOptions = getAllGeoTypes(countries);
  const sovereigntyOptions = getAllSovereigntyStatuses(countries);

  // Key handler for resetting filters with "R" key
  useKeyHandler(
    (e) => {
      e.preventDefault();
      resetFilters();
    },
    ["r", "R"],
    { enabled: show, allowSingleKeyShortcuts: singleKeyShortcutsEnabled },
  );

  // Responsive check
  const { isMobile } = useScreenSize();
  const { isRtl } = useLanguage();

  return (
    <Panel
      title={
        <>
          <ICONS.filters />
          {t("countries.filters.title")}
        </>
      }
      width={DEFAULT_PANEL_WIDTH}
      show={show}
      onHide={onHide}
      headerActions={
        <>
          <ActionButton
            onClick={resetFilters}
            ariaLabel={t("common:actions.resetFilters")}
            title={t("common:actions.resetFilters")}
            icon={<ICONS.reset />}
            rounded
          />
        </>
      }
      animationsEnabled={animationsEnabled}
      className={isMobile ? "panel-mobile-fullscreen" : ""}
      style={
        !isMobile
          ? isRtl
            ? { right: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH, zIndex: 39 }
            : { left: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH, zIndex: 39 }
          : undefined
      }
    >
      <div className="mt-4">
        <CoreFilters
          expanded={showCoreFilters}
          onToggle={() => setShowCoreFilters((v) => !v)}
          subregionOptions={subregionOptions}
          geoTypeOptions={geoTypeOptions}
          sovereigntyOptions={sovereigntyOptions}
          allRegions={allRegions}
          subregionToRegion={subregionToRegion}
        />
        {!timelineMode && !visitedOnly && hasVisibleLayers && (
          <>
            <Separator className="my-4" />
            <LayerFilters
              layers={visibleLayers}
              expanded={showLayerFilters}
              onToggle={() => setShowLayerFilters((v) => !v)}
            />
          </>
        )}
        {timelineMode && (
          <>
            <Separator className="my-4" />
            <TimelineFilters
              expanded={showTimelineFilters}
              onToggle={() => setShowTimelineFilters((v) => !v)}
              minVisitCount={minVisitCount}
              setMinVisitCount={setMinVisitCount}
              maxVisitCount={maxVisitCount}
              setMaxVisitCount={setMaxVisitCount}
            />
          </>
        )}
      </div>
    </Panel>
  );
}
