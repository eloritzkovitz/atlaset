import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  DialogHeader,
  DrawerPanel,
  Panel,
  Separator,
} from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH, DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useEffectiveLayers } from "@features/atlas/layers";
import { useTimeline } from "@features/atlas/timeline";
import type { Country } from "@features/countries/types";
import { getAllSovereigntyStatuses } from "@features/countries";
import { useAccessibility } from "@features/settings/accessibility";
import { useLanguage } from "@features/settings/account";
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

  const title = (
    <>
      <ICONS.filters />
      {t("countries.filters.title")}
    </>
  );
  const resetButton = (
    <ActionButton
      onClick={resetFilters}
      ariaLabel={t("common:actions.resetFilters")}
      title={t("common:actions.resetFilters")}
      icon={<ICONS.reset />}
      rounded
    />
  );
  const filterContent = (
    <div className="mt-4">
      <CoreFilters
        expanded={showCoreFilters}
        onToggle={() => setShowCoreFilters((v) => !v)}
        subregionOptions={subregionOptions}
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
  );

  if (isMobile) {
    return (
      <DrawerPanel isOpen={show} onClose={onHide} width="100%">
        <div className="flex h-full flex-col">
          <DialogHeader title={title} onClose={onHide}>
            {resetButton}
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-20">
            {filterContent}
          </div>
        </div>
      </DrawerPanel>
    );
  }

  return (
    <Panel
      title={title}
      width={DEFAULT_PANEL_WIDTH}
      show={show}
      onHide={onHide}
      headerActions={resetButton}
      animationsEnabled={animationsEnabled}
      style={
        isRtl
          ? { right: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH, zIndex: 39 }
          : { left: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH, zIndex: 39 }
      }
    >
      {filterContent}
    </Panel>
  );
}
