import { useCallback, useEffect } from "react";
import { FaFilter, FaGlobe, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  ErrorMessage,
  LoadingSpinner,
  Panel,
  Separator,
} from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import { useCountryFilters } from "@features/atlas/countries/hooks/useCountryFilters";
import { sortCountries } from "@features/countries/utils/countrySort";
import { useListNavigation } from "@hooks/useListNavigation";
import { useSort } from "@hooks/useSort";
import type { Country } from "@types";
import { CountriesSearchSortBar } from "./CountriesSearchSortBar";
import { CountriesToolbar } from "./CountriesToolbar";
import { CountryList } from "./CountryList";
import { CountryFiltersPanel } from "../countryFilters/CountryFiltersPanel";

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
  const { allRegions, allSubregions, loading, error, refreshData } =
    useCountryData();
  const { showVisitedOnly } = useTimeline();
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

  // Reset sort when showVisitedOnly changes
  useEffect(() => {
    setSortBy("name-asc");
  }, [showVisitedOnly, setSortBy]);

  // Keyboard navigation within country list
  useListNavigation({
    items: sortedCountries,
    getKey: (c) => c.isoCode,
    selectedKey: selectedIsoCode,
    hoveredKey: hoveredIsoCode,
    onSelect,
    onHover,
    onItemInfo: onCountryInfo,
    enabled: uiVisible && showCountries,
  });

  // Handle country info action
  const handleCountryInfo = useCallback(
    (country: Country) => {
      if (onCountryInfo) onCountryInfo(country);
    },
    [onCountryInfo]
  );

  // Show loading or error states
  if (loading) return <LoadingSpinner message="Loading countries..." />;
  if (error) return <ErrorMessage error={error} />;

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
            <ActionButton
              onClick={toggleFilters}
              ariaLabel={showFilters ? "Hide Filters" : "Show Filters"}
              title="Filters"
              icon={<FaFilter />}
            />
            <ActionButton
              onClick={toggleCountries}
              ariaLabel="Hide countries panel"
              title="Hide"
              icon={<FaXmark />}
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
            count={sortedCountries.length}
            visitedOnly={showVisitedOnly}
          />
          <Separator />
          <CountryList
            countries={sortedCountries}
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onSelect={onSelect}
            onHover={onHover}
            onCountryInfo={handleCountryInfo}
          />
          <Separator />
          <CountriesToolbar
            allCount={allCount}
            visitedCount={visitedCount}
            onRefresh={refreshData}
          />
        </div>
      </Panel>

      {/* Filters panel */}
      {showCountries && showFilters && (
        <CountryFiltersPanel
          show={showFilters && !selectedCountry}
          onHide={toggleFilters}
          showVisitedOnly={showVisitedOnly}
          allRegions={allRegions}
          allSubregions={allSubregions}
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
