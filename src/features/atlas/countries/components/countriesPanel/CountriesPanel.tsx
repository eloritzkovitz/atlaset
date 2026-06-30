import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@contexts/CountryListsContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import {
  sortCountries,
  useCountryData,
  type Country,
} from "@features/countries";
import { buildVisitContext } from "@features/visits/utils/visits";
import { useSort } from "@hooks";
import { CountriesSearchSortBar } from "./CountriesSearchSortBar";
import { CountryListView } from "./CountryListView";
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
  const { t } = useTranslation("atlas");
  const { refreshData } = useCountryData();
  const {
    countryLists,
    selectedListId,
    setSelectedListId,
    openAddModal,
    openEditModal,
  } = useCountryLists();
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
    selectedGeoType,
    setSelectedGeoType,
    selectedSovereignty,
    setSelectedSovereignty,
    selectedVisited,
    setSelectedVisited,
    search,
    setSearch,
    filteredCountries,
    searchedCountries,
    allCount,
    sovereignCount,
    sovereignOnly,
    setSovereignOnly,
    visitedCount,
    wantToVisitCount,
    wantToVisitOnly,
    setWantToVisitOnly,
    minVisitCount,
    setMinVisitCount,
    maxVisitCount,
    setMaxVisitCount,
    resetFilters,
  } = useCountryFilters();

  // Compute counts for country lists based on filtered countries
  const dynamicCountryLists = useMemo(() => {
    return countryLists.map((list) => {
      const matchingCount = list.countryCodes.filter((code) =>
        searchedCountries.some((c) => c.isoCode === code),
      ).length;

      return {
        ...list,
        count: matchingCount,
      };
    });
  }, [countryLists, searchedCountries]);

  // Keep selectedVisited/selectedSovereignty consistent when toggles change
  useEffect(() => {
    if (showVisitedOnly && selectedVisited !== "visited") {
      setSelectedVisited("visited");
    }
    if (!showVisitedOnly && selectedVisited === "visited") {
      setSelectedVisited("any");
    }
  }, [showVisitedOnly, selectedVisited, setSelectedVisited]);

  useEffect(() => {
    if (sovereignOnly && selectedSovereignty !== "sovereign") {
      setSelectedSovereignty("sovereign");
    }
    if (!sovereignOnly && selectedSovereignty === "sovereign") {
      setSelectedSovereignty("");
    }
  }, [sovereignOnly, selectedSovereignty, setSelectedSovereignty]);

  useEffect(() => {
    if (showVisitedOnly && wantToVisitOnly) {
      setWantToVisitOnly(false);
    }
  }, [showVisitedOnly, wantToVisitOnly, setWantToVisitOnly]);

  useEffect(() => {
    if (wantToVisitOnly && showVisitedOnly) {
      setShowVisitedOnly(false);
    }
  }, [wantToVisitOnly, showVisitedOnly, setShowVisitedOnly]);

  // Sort state
  const {
    sortBy,
    setSortBy,
    sortedItems: sortedCountries,
  } = useSort(
    filteredCountries,
    (items, sortBy) => sortCountries(items, sortBy, buildVisitContext(trips)),
    "name-asc",
  );

  // Reset sort when toggles change
  useEffect(() => {
    setSortBy("name-asc");
  }, [showVisitedOnly, sovereignOnly, wantToVisitOnly, setSortBy]);

  // Handle country info action
  const handleCountryInfo = useCallback(
    (country: Country) => {
      if (onCountryInfo) onCountryInfo(country);
    },
    [onCountryInfo],
  );

  // Reset filters and sort
  const handleResetFilters = () => {
    resetFilters();
    setSortBy("name-asc");
  };

  return (
    <div className="fixed top-0 start-0 h-screen z-40 group relative">
      <Panel
        title={
          <>
            <ICONS.countries />
            {t("countries.title")}
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
                ariaLabel={t("countries.actions.refreshData")}
                title={t("countries.actions.refreshData")}
                icon={<ICONS.refresh />}
                rounded
              />
            )}
            <ActionButton
              onClick={toggleFilters}
              ariaLabel={
                showFilters
                  ? t("countries.actions.hideFilters")
                  : t("countries.actions.showFilters")
              }
              title={
                showFilters
                  ? t("countries.actions.hideFilters")
                  : t("countries.actions.showFilters")
              }
              icon={<ICONS.filters />}
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
            sovereignOnly={sovereignOnly}
            setSovereignOnly={setSovereignOnly}
            visitedOnly={showVisitedOnly}
            setVisitedOnly={setShowVisitedOnly}
            wantToVisitOnly={wantToVisitOnly}
            setWantToVisitOnly={setWantToVisitOnly}
            allCount={allCount}
            sovereignCount={sovereignCount}
            visitedCount={visitedCount}
            wantToVisitCount={wantToVisitCount}
            countryLists={dynamicCountryLists}
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
            onAddList={openAddModal}
            onEditList={openEditModal}
          />
          <Separator />
          <CountryListView
            countries={sortedCountries}
            selectedIsoCode={selectedIsoCode}
            hoveredIsoCode={hoveredIsoCode}
            onSelect={onSelect}
            onHover={onHover}
            onCountryInfo={handleCountryInfo}
          />
        </div>
      </Panel>
      {showCountries && (
        <CountryFiltersPanel
          show={showFilters && !selectedCountry}
          onHide={toggleFilters}
          showVisitedOnly={showVisitedOnly}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedSubregion={selectedSubregion}
          setSelectedSubregion={setSelectedSubregion}
          selectedGeoType={selectedGeoType}
          setSelectedGeoType={setSelectedGeoType}
          selectedSovereignty={selectedSovereignty}
          setSelectedSovereignty={setSelectedSovereignty}
          sovereignOnly={sovereignOnly}
          selectedVisited={selectedVisited}
          setSelectedVisited={setSelectedVisited}
          visitedOnly={showVisitedOnly}
          minVisitCount={minVisitCount}
          setMinVisitCount={setMinVisitCount}
          maxVisitCount={maxVisitCount}
          setMaxVisitCount={setMaxVisitCount}
          resetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}
