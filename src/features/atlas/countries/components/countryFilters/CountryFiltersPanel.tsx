import React from "react";
import { FaFilter, FaArrowRotateLeft, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  ErrorMessage,
  LoadingSpinner,
  Panel,
  Separator,
} from "@components";
import { DEFAULT_PANEL_WIDTH, DEFAULT_SIDEBAR_WIDTH } from "@constants";
import { useCountryData } from "@contexts/CountryDataContext";
import { useTimeline } from "@contexts/TimelineContext";
import {
  getAllSovereigntyTypes,
  getSubregionsForRegion,
} from "@features/countries/utils/countryData";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { CoreFilters } from "./CoreFilters";
import { OverlayFilters } from "./OverlayFilters";
import { TimelineFilters } from "./TimelineFilters";

interface CountryFiltersPanelProps {
  show: boolean;
  onHide: () => void;
  showVisitedOnly: boolean;
  allRegions: string[];
  allSubregions: string[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedSovereignty: string;
  setSelectedSovereignty: (type: string) => void;
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
  allRegions,
  allSubregions,
  selectedRegion,
  setSelectedRegion,
  selectedSubregion,
  setSelectedSubregion,
  selectedSovereignty,
  setSelectedSovereignty,
  minVisitCount,
  setMinVisitCount,
  maxVisitCount,
  setMaxVisitCount,
  resetFilters,
}: CountryFiltersPanelProps) {
  const { countries, loading, error } = useCountryData();
  const { timelineMode } = useTimeline();

  // Collapsible state for filter groups
  const [showCoreFilters, setShowCoreFilters] = React.useState(true);
  const [showOverlayFilters, setShowOverlayFilters] = React.useState(true);
  const [showTimelineFilters, setShowTimelineFilters] = React.useState(true);

  // Dynamic subregion options based on selected region
  const subregionOptions =
    selectedRegion && selectedRegion !== ""
      ? getSubregionsForRegion(countries, selectedRegion)
      : allSubregions;

  // All sovereignty types from country data
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
    show
  );

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading filters..." />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Panel
      title={
        <>
          <FaFilter />
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
          >
            <FaArrowRotateLeft />
          </ActionButton>
          <ActionButton
            onClick={onHide}
            ariaLabel="Close filters panel"
            title="Close"
            className="action-btn action-btn-close"
          >
            <FaXmark />
          </ActionButton>
        </>
      }
      style={{
        left: DEFAULT_PANEL_WIDTH + DEFAULT_SIDEBAR_WIDTH,
        zIndex: 39,
      }}
    >
      <CoreFilters
        expanded={showCoreFilters}
        onToggle={() => setShowCoreFilters((v) => !v)}
        selectedRegion={selectedRegion}
        handleRegionChange={handleRegionChange}
        selectedSubregion={selectedSubregion}
        setSelectedSubregion={setSelectedSubregion}
        selectedSovereignty={selectedSovereignty}
        setSelectedSovereignty={setSelectedSovereignty}
        allRegions={allRegions}
        subregionOptions={subregionOptions}
        sovereigntyOptions={sovereigntyOptions}
      />
      {!showVisitedOnly && (
        <>
          <Separator className="my-4" />
          <OverlayFilters
            expanded={showOverlayFilters}
            onToggle={() => setShowOverlayFilters((v) => !v)}
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
    </Panel>
  );
}
