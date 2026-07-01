import React from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH, DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useTimeline } from "@contexts/TimelineContext";
import {
  useCountryData,
  type GeoType,
  type SovereigntyStatus,
} from "@features/countries";
import {
  getAllGeoTypes,
  getAllSovereigntyStatuses,
} from "@features/countries/utils/countryData";
import { useLanguage } from "@features/settings";
import type { VisitedStatus } from "@features/visits";
import { useKeyHandler, useScreenSize } from "@hooks";
import { CoreFilters } from "./CoreFilters";
import { LayerFilters } from "./LayerFilters";
import { TimelineFilters } from "./TimelineFilters";
import { useRegionSubregionSelection } from "../../hooks/useRegionSubregionSelection";

interface CountryFiltersPanelProps {
  show: boolean;
  onHide: () => void;
  showVisitedOnly: boolean;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedGeoType: GeoType | "";
  setSelectedGeoType: (geoType: GeoType | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  setSelectedSovereignty: (status: SovereigntyStatus | "") => void;
  sovereignOnly: boolean;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (visited: VisitedStatus) => void;
  visitedOnly: boolean;
  minVisitCount: number;
  setMinVisitCount: React.Dispatch<React.SetStateAction<number>>;
  maxVisitCount: number | undefined;
  setMaxVisitCount: React.Dispatch<React.SetStateAction<number | undefined>>;
  resetFilters: () => void;
}

export function CountryFiltersPanel({
  show,
  onHide,
  showVisitedOnly,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedGeoType,
  setSelectedGeoType,
  selectedSovereignty,
  setSelectedSovereignty,
  sovereignOnly,
  selectedVisited,
  setSelectedVisited,
  visitedOnly,
  minVisitCount,
  setMinVisitCount,
  maxVisitCount,
  setMaxVisitCount,
  resetFilters,
}: CountryFiltersPanelProps) {
  const { countries } = useCountryData();
  const { timelineMode } = useTimeline();
  const { t } = useTranslation("atlas");

  // Collapsible state for filter groups
  const [showCoreFilters, setShowCoreFilters] = React.useState(true);
  const [showLayerFilters, setShowLayerFilters] = React.useState(true);
  const [showTimelineFilters, setShowTimelineFilters] = React.useState(true);

  // Subregion options based on selected region
  const { subregionOptions } = useRegionSubregionSelection(
    selectedRegion,
    selectedSubregion,
    setSelectedRegion,
  );

  // All sovereignty statuses from country data
  const geoTypeOptions = getAllGeoTypes(countries);
  const sovereigntyOptions = getAllSovereigntyStatuses(countries);

  // Reset subregion when region changes
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedSubregion("");
  };

  // Key handler for resetting filters with "R" key
  useKeyHandler(
    (e) => {
      e.preventDefault();
      resetFilters();
    },
    ["r", "R"],
    show,
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
          selectedRegion={selectedRegion}
          handleRegionChange={handleRegionChange}
          selectedSubregion={selectedSubregion}
          selectedGeoType={selectedGeoType}
          setSelectedGeoType={setSelectedGeoType}
          setSelectedSubregion={setSelectedSubregion}
          selectedSovereignty={selectedSovereignty}
          setSelectedSovereignty={setSelectedSovereignty}
          sovereignOnly={sovereignOnly}
          selectedVisited={selectedVisited}
          setSelectedVisited={setSelectedVisited}
          visitedOnly={visitedOnly}
          subregionOptions={subregionOptions}
          geoTypeOptions={geoTypeOptions}
          sovereigntyOptions={sovereigntyOptions}
        />
        {!showVisitedOnly && (
          <>
            <Separator className="my-4" />
            <LayerFilters
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
