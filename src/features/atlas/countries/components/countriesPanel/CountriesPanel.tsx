import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowsRotate, FaFilter, FaGlobe, FaXmark } from "react-icons/fa6";
import { ActionButton, Panel, Separator } from "@components";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import {
  sortCountries,
  useCountryData,
  type Country,
} from "@features/countries";
import { useListNavigation, useSort } from "@hooks";
import { CountriesSearchSortBar } from "./CountriesSearchSortBar";
import { CountryList } from "./CountryList";
import { CountryFiltersPanel } from "../countryFilters/CountryFiltersPanel";
import { useCountryFilters } from "../../hooks/useCountryFilters";

interface CountriesPanelProps {
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  selectedCountry: Country | null;
  onSelect: (iso: string | null) => void;
  onHover: (iso: string | null) => void;
  onCountryInfo?: (country: Country) => void;
}

export function CountriesPanel({
  selectedIsoCode,
  hoveredIsoCode,
  selectedCountry,
  onSelect,
  onHover,
  onCountryInfo,
}: CountriesPanelProps) {
  // Context data state
  const { refreshData } = useCountryData();
  const { showVisitedOnly, setShowVisitedOnly } = useTimeline();
  const { trips } = useTrips();
  const {
    uiVisible,
    showCountries,
    toggleCountries,
    showFilters,
    toggleFilters,
  } = useUI();

  // Filter state
  const {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedSovereignty,
    setSelectedSovereignty,
    search,
    setSearch,
    filteredCountries,
    allCount,
    sovereignCount,
    sovereignOnly,
    setSovereignOnly,
    visitedCount,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
    resetFilters,
  } = useCountryFilters();

  // Sort state
  const {
    sortBy,
    setSortBy,
    sortedItems: sortedCountries,
  } = useSort(
    filteredCountries,
    (items, sortBy) => sortCountries(items, sortBy, trips),
    "name-asc"
  );

  // Reset sort when toggles change
  useEffect(() => {
    setSortBy("name-asc");
  }, [showVisitedOnly, sovereignOnly, setSortBy]);

  // Keyboard navigation state
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [isListFocused, setIsListFocused] = useState(false);

  // Keyboard navigation within country list
  useListNavigation({
    items: sortedCountries,
    getKey: (c) => c.isoCode,
    selectedKey: selectedIsoCode,
    hoveredKey: hoveredIsoCode,
    onSelect,
    onHover,
    onItemInfo: onCountryInfo,
    enabled: uiVisible && showCountries && isListFocused,
  });

  // Handle country info action
  const handleCountryInfo = useCallback(
    (country: Country) => {
      if (onCountryInfo) onCountryInfo(country);
    },
    [onCountryInfo]
  );

  return (
    <div className="fixed top-0 left-0 h-screen z-40 group relative">
      <Panel
        title={
          <>
            <FaGlobe />
            Countries
          </>
        }
        show={uiVisible && showCountries}
        onHide={toggleCountries}
        escEnabled={!showFilters && !selectedCountry}
        showSeparator={false}
        headerActions={
          <>
            {process.env.NODE_ENV === "development" && (
              <ActionButton
                onClick={refreshData}
                ariaLabel={"Refresh country data"}
                title="Refresh country data"
                icon={<FaArrowsRotate />}
                rounded
              />
            )}
            <ActionButton
              onClick={toggleFilters}
              ariaLabel={showFilters ? "Hide Filters" : "Show Filters"}
              title="Filters"
              icon={<FaFilter />}
              rounded
            />
            <ActionButton
              onClick={toggleCountries}
              ariaLabel="Close countries panel"
              title="Close"
              icon={<FaXmark className="text-2xl" />}
              rounded
            />
          </>
        }
      >
        <div className="flex flex-col h-full">
          <CountriesSearchSortBar
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={(v: string) => setSortBy(v as typeof sortBy)}
            visitedOnly={showVisitedOnly}
            setVisitedOnly={setShowVisitedOnly}
            sovereignOnly={sovereignOnly}
            setSovereignOnly={setSovereignOnly}
            allCount={allCount}
            sovereignCount={sovereignCount}
            visitedCount={visitedCount}
          />
          <Separator />
          <CountryList
            ref={listContainerRef}
            setIsFocused={setIsListFocused}
            countries={sortedCountries}
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onSelect={onSelect}
            onHover={onHover}
            onCountryInfo={handleCountryInfo}
          />
        </div>
      </Panel>

      {/* Filters panel */}
      {showCountries && (
        <CountryFiltersPanel
          show={showFilters && !selectedCountry}
          onHide={toggleFilters}
          showVisitedOnly={showVisitedOnly}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedSubregion={selectedSubregion}
          setSelectedSubregion={setSelectedSubregion}
          selectedSovereignty={selectedSovereignty}
          setSelectedSovereignty={setSelectedSovereignty}
          minVisitCount={minVisitCount}
          setMinVisitCount={setMinVisitCount}
          maxVisitCount={maxVisitCount}
          setMaxVisitCount={setMaxVisitCount}
          resetFilters={resetFilters}
        />
      )}
    </div>
  );
}
