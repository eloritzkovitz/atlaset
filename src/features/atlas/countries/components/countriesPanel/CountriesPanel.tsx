import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@contexts/CountryListsContext";
import { CountryListModal } from "./CountryListModal";
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
  const { refreshData } = useCountryData();
  const {
    countryLists,
    selectedListId,
    setSelectedListId,
    addList,
    deleteList,
  } = useCountryLists();

  // Modal state for creating/editing a list
  const [listModalOpen, setListModalOpen] = useState(false);
  const [newList, setNewList] = useState(
    null as null | { id: string; name: string; countryCodes: string[] },
  );
  const [isEditingList, setIsEditingList] = useState(false);
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
    (items, sortBy) => sortCountries(items, sortBy, trips),
    "name-asc",
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

  // Handler for editing a list
  const handleEditList = (listId: string) => {
    const list = countryLists.find((l) => l.id === listId);
    if (list) {
      setNewList({ ...list });
      setIsEditingList(true);
      setListModalOpen(true);
    }
  };

  // Handler for deleting a list
  const handleDeleteList = (listId: string) => {
    if (deleteList) {
      deleteList(listId);
    }
  };

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
    <div className="fixed top-0 left-0 h-screen z-40 group relative">
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
            onAddList={() => {
              setNewList({
                id: crypto.randomUUID(),
                name: "",
                countryCodes: [],
              });
              setIsEditingList(false);
              setListModalOpen(true);
            }}
            onEditList={handleEditList}
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

      {/* List creation/editing modal */}
      <CountryListModal
        isOpen={listModalOpen}
        isEditing={isEditingList}
        list={newList}
        onChange={setNewList}
        onDelete={handleDeleteList}
        onSave={async (list) => {
          await addList(list);
          setListModalOpen(false);
          setNewList(null);
          setIsEditingList(false);
        }}
        onClose={() => {
          setListModalOpen(false);
          setNewList(null);
          setIsEditingList(false);
        }}
      />

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
          selectedVisited={selectedVisited}
          setSelectedVisited={setSelectedVisited}
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
