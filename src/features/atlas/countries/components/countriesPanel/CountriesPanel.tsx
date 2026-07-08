import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryFilters } from "@contexts/CountryFiltersContext";
import { useCountryLists } from "@contexts/CountryListsContext";
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
  const { trips } = useTrips();
  const {
    uiVisible,
    showCountries,
    toggleCountries,
    showFilters,
    toggleFilters,
  } = useUI();

  // Filter state
  const { resetFilters, ...filterProps } = useCountryFilters();
  const {
    countryLists,
    selectedListId,
    setSelectedListId,
    openAddModal,
    openEditModal,
  } = useCountryLists();

  // Sort state
  const {
    sortBy,
    setSortBy,
    sortedItems: sortedCountries,
  } = useSort(
    filterProps.filteredCountries,
    (items, currentSort) =>
      sortCountries(items, currentSort, buildVisitContext(trips)),
    "name-asc",
  );

  // Compute counts for country lists based on filtered countries
  const dynamicCountryLists = useMemo(() => {
    const searchedCodes = new Set(
      filterProps.searchedCountries.map((c) => c.isoCode),
    );
    return countryLists.map((list) => ({
      ...list,
      count: list.countryCodes.filter((code) => searchedCodes.has(code)).length,
    }));
  }, [countryLists, filterProps.searchedCountries]);

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
            search={filterProps.search}
            setSearch={filterProps.setSearch}
            sortBy={sortBy}
            setSortBy={(v) => setSortBy(v as typeof sortBy)}
            sovereignOnly={filterProps.sovereignOnly}
            setSovereignOnly={filterProps.setSovereignOnly}
            visitedOnly={filterProps.showVisitedOnly}
            setVisitedOnly={filterProps.setShowVisitedOnly}
            wantToVisitOnly={filterProps.wantToVisitOnly}
            setWantToVisitOnly={filterProps.setWantToVisitOnly}
            allCount={filterProps.allCount}
            sovereignCount={filterProps.sovereignCount}
            visitedCount={filterProps.visitedCount}
            wantToVisitCount={filterProps.wantToVisitCount}
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
            onCountryInfo={onCountryInfo}
          />
        </div>
      </Panel>

      {showCountries && (
        <CountryFiltersPanel
          show={showFilters && !selectedCountry}
          onHide={toggleFilters}
          visitedOnly={filterProps.showVisitedOnly}
          resetFilters={handleResetFilters}
          {...filterProps}
        />
      )}
    </div>
  );
}
