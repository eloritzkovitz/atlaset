import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { FloatingActionButton, SplashScreen } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { useTrips } from "@contexts/TripsContext";
import { TripModal, TripsTable, TripsToolbar } from "@features/trips";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useTripModal } from "@features/trips/hooks/useTripModal";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import { useIsMobile } from "@hooks/useIsMobile";
import { usePagination } from "@hooks/usePagination";
import type { Trip } from "@types";

export default function TripsPage() {
  const countryData = useCountryData();
  const {
    trips,
    loading,
    addTrip,
    editTrip,
    updateTripRating,
    removeTrip,
    duplicateTrip,
  } = useTrips();
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [showRowNumbers, setShowRowNumbers] = useState(false);
  const isMobile = useIsMobile();

  // Trip filtering hook
  const {
    filteredTrips,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    countryOptions,
    yearOptions,
    categoryOptions,
    statusOptions,
    tagOptions,
  } = useTripFilters(trips, countryData, undefined, globalSearch);

  const {
    data: paginatedTrips,
    hasMore,
    loadMore,
  } = usePagination({
    items: filteredTrips,
    pageSize: 20,
    mode: "local",
  });

  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  // Determine if all trips are selected
  const allSelected =
    selectedTripIds.length === filteredTrips.length && filteredTrips.length > 0;

  // Get selected trips for bulk actions
  const selectedTrips = filteredTrips.filter((trip) =>
    selectedTripIds.includes(trip.id)
  );

  // Selection handlers
  function handleSelectTrip(id: string) {
    setSelectedTripIds((prev) =>
      prev.includes(id) ? prev.filter((tripId) => tripId !== id) : [...prev, id]
    );
  }

  // Select all handler
  function handleSelectAll() {
    if (selectedTripIds.length === filteredTrips.length) {
      setSelectedTripIds([]);
    } else {
      setSelectedTripIds(filteredTrips.map((trip) => trip.id));
    }
  }

  // Bulk duplicate handler
  function handleBulkDuplicate() {
    selectedTrips.forEach((trip) => duplicateTrip(trip));
  }

  // Bulk delete handler
  async function handleBulkDelete() {
    for (const id of selectedTripIds) {
      await removeTrip(id);
    }
    setSelectedTripIds([]);
  }

  // Trip modal hook
  const {
    trip,
    setTrip,
    modalOpen,
    setModalOpen,
    handleAdd,
    handleEdit,
    handleSave,
  } = useTripModal({ addTrip, editTrip, trips });

  // Delete trip
  async function handleDelete(trip: Trip) {
    if (confirm(`Are you sure you want to delete the trip "${trip.name}"?`)) {
      await removeTrip(trip.id);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Toolbar */}
      {!isMobile && (
        <TripsToolbar
          trips={filteredTrips}
          filters={filters}
          setFilters={setFilters}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          resetFilters={resetFilters}
          selectedTripIds={selectedTripIds}
          showRowNumbers={showRowNumbers}
          setShowRowNumbers={setShowRowNumbers}
          onBulkDuplicate={handleBulkDuplicate}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Table area */}
      <div className="flex-1 w-full mx-auto flex flex-col">
        <TripModal
          isOpen={modalOpen}
          trip={trip}
          onChange={setTrip}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          isEditing={!!trip && !!trip.id}
        />
        {loading ? (
          <SplashScreen />
        ) : trips.length === 0 ? (
          <div className="flex flex-1 items-center justify-center min-h-[300px] text-muted text-lg">
            No trips yet.
          </div>
        ) : (
          <>
            <TripsTable
              trips={paginatedTrips}
              onEdit={handleEdit}
              onRatingChange={updateTripRating}
              onDelete={handleDelete}
              filters={filters}
              updateFilter={(key: string, value: any) =>
                updateFilter(key as any, value)
              }
              countryOptions={countryOptions}
              yearOptions={yearOptions}
              categoryOptions={categoryOptions}
              statusOptions={statusOptions}
              tagOptions={tagOptions}
              selectedTripIds={selectedTripIds}
              onSelectTrip={handleSelectTrip}
              allSelected={allSelected}
              handleSelectAll={handleSelectAll}
              showRowNumbers={showRowNumbers}
            />
            <div ref={sentinelRef} />
          </>
        )}
      </div>
      <FloatingActionButton
        onClick={handleAdd}
        icon={<FaPencilAlt />}
        ariaLabel="Add Trip"
        title="Add Trip"
        className={!isMobile ? "bottom-8 right-8" : "bottom-20 right-2"}
      />
    </div>
  );
}
