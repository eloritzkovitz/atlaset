import { useCallback, useEffect, useState } from "react";
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
  type CountryList,
} from "@features/countries";
import { buildVisitContext } from "@features/visits/utils/visits";
import { useSort } from "@hooks";
import { CountriesSearchSortBar } from "./CountriesSearchSortBar";
import { CountryListModal } from "./CountryListModal";
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
  const { refreshData } = useCountryData();
  const {
    countryLists,
    selectedListId,
    setSelectedListId,
    addList,
    deleteList,
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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentList, setCurrentList] = useState<CountryList | null>(null);

  const openAddModal = useCallback(() => {
    setCurrentList({ id: crypto.randomUUID(), name: "", countryCodes: [] });
    setIsEditing(false);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback(
    (listId: string) => {
      const list = countryLists.find((l) => l.id === listId);
      if (list) {
        setCurrentList({ ...list });
        setIsEditing(true);
        setModalOpen(true);
      }
    },
    [countryLists],
  );

  const handleSave = useCallback(
    async (list: CountryList) => {
      await addList(list);
      setModalOpen(false);
      setCurrentList(null);
      setIsEditing(false);
    },
    [addList],
  );

  const handleDelete = useCallback(
    async (listId: string) => {
      await deleteList(listId);
      setModalOpen(false);
      setCurrentList(null);
      setIsEditing(false);
    },
    [deleteList],
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setCurrentList(null);
    setIsEditing(false);
  }, []);

  const handleChange = useCallback((list: CountryList) => {
    setCurrentList(list);
  }, []);

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
    if (sovereignOnly && selectedSovereignty !== "Sovereign") {
      setSelectedSovereignty("Sovereign");
    }
    if (!sovereignOnly && selectedSovereignty === "Sovereign") {
      setSelectedSovereignty("");
    }
  }, [sovereignOnly, selectedSovereignty, setSelectedSovereignty]);

  // Compute filtered iso codes for custom list counts
  const filteredIsoCodes = filteredCountries.map((c) => c.isoCode);
  const customListOptions = countryLists.map((list) => ({
    ...list,
    count: filteredIsoCodes.filter((code) => list.countryCodes.includes(code))
      .length,
  }));

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
  }, [showVisitedOnly, sovereignOnly, setSortBy]);

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
                icon={<ICONS.refresh />}
                rounded
              />
            )}
            <ActionButton
              onClick={toggleFilters}
              ariaLabel={showFilters ? "Hide Filters" : "Show Filters"}
              title="Filters"
              icon={<ICONS.filters />}
              rounded
            />
            <ActionButton
              onClick={toggleCountries}
              ariaLabel="Close countries panel"
              title="Close"
              icon={<ICONS.close className="text-2xl" />}
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
            countryLists={customListOptions}
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
      <CountryListModal
        isOpen={modalOpen}
        isEditing={isEditing}
        list={currentList}
        onChange={handleChange}
        onDelete={handleDelete}
        onSave={handleSave}
        onClose={handleClose}
      />
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
