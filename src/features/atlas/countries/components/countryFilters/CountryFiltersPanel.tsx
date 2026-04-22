import React from "react";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { DEFAULT_PANEL_WIDTH, DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useTimeline } from "@contexts/TimelineContext";
import { useCountryData, type GeoType, type SovereigntyType } from "@features/countries";
import { getAllGeoTypes, getAllSovereigntyTypes } from "@features/countries/utils/countryData";
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
  selectedSovereignty: SovereigntyType | "";
  setSelectedSovereignty: (type: SovereigntyType | "") => void;
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

  // All sovereignty types from country data
  const geoTypeOptions = getAllGeoTypes(countries);
  const sovereigntyOptions = getAllSovereigntyTypes(countries);

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

  return (
    <Panel
      title={
        <>
          <ICONS.filters />
          Filters
        </>
      }
      width={DEFAULT_PANEL_WIDTH}
      show={show}
      onHide={onHide}
      headerActions={
        <>
          <ActionButton
            onClick={resetFilters}
            ariaLabel="Reset all filters"
            title="Reset filters"
            icon={<ICONS.reset />}
            rounded
          />
          <ActionButton
            onClick={onHide}
            ariaLabel="Close filters panel"
            title="Close"
            icon={<ICONS.close className="text-2xl" />}
            rounded
          />
        </>
      }
      className={isMobile ? "panel-mobile-fullscreen" : ""}
      style={
        !isMobile
          ? {
              left: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH,
              zIndex: 39,
            }
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
