import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@components";
import { useTrips } from "@contexts/TripsContext";
import { useUI } from "@contexts/UIContext";
import { useCountryData } from "@features/countries";
import {
  TripModal,
  TripsTable,
  TripsToolbar,
  type Trip,
  type TripFilterState,
  type TripSortBy,
} from "@features/trips";
import { sortTrips } from "@features/trips/utils/tripSort";
import { useTripFilters } from "@features/trips/hooks/useTripFilters";
import { useTripModal } from "@features/trips/hooks/useTripModal";
import { usePageTitle, useScreenSize, useTablePagination } from "@hooks";

export default function TripsPage() {
  const { t } = useTranslation("trips");
  const { t: tCommon } = useTranslation("common");
  const countryData = useCountryData();
  const {
    trips,
    sharedTripIds,
    loading,
    addTrip,
    editTrip,
    updateTripRating,
    removeTrip,
    duplicateTrip,
  } = useTrips();
  const { isMobile } = useScreenSize();
  const { toggleCalendar, handleViewInCalendar } = useUI();

  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [showRowNumbers, setShowRowNumbers] = useState(false);
  const [sortBy, setSortBy] = useState<TripSortBy>("startDate-desc");

  // Set page title
  const appName = tCommon("appName", "Atlaset");
  const pageTitle = t("pageTitle", "Trips");
  usePageTitle(`${pageTitle} | ${appName}`);

  // Trip filtering hook
  const {
    filteredTrips,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    countryOptions,
    yearOptions,
    participantsOptions,
    categoryOptions,
    statusOptions,
    tagOptions,
  } = useTripFilters(trips, countryData, undefined, globalSearch);

  // Sort trips
  const sortedTrips = sortTrips(
    filteredTrips,
    countryData?.countries ?? [],
    sortBy,
  );

  // Table pagination hook
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedItems: paginatedTrips,
    totalCount: totalTripsCount,
  } = useTablePagination({
    items: sortedTrips,
    initialPage: 1,
    initialPageSize: 20,
  });

  // Determine if all trips are selected
  const allSelected =
    selectedTripIds.length === filteredTrips.length && filteredTrips.length > 0;

  // Get selected trips for bulk actions
  const selectedTrips = filteredTrips.filter((trip) =>
    selectedTripIds.includes(trip.id),
  );

  // Only allow non-shared trips for bulk actions
  const nonSharedSelectedTrips = selectedTrips.filter(
    (trip) => !sharedTripIds.has(trip.id),
  );

  // Selection handlers
  function handleSelectTrip(id: string) {
    // Prevent selecting shared trips
    if (sharedTripIds.has(id)) return;

    setSelectedTripIds((prev) =>
      prev.includes(id)
        ? prev.filter((tripId) => tripId !== id)
        : [...prev, id],
    );
  }

  // Select all handler
  function handleSelectAll() {
    const nonSharedTripIds = filteredTrips
      .filter((trip) => !sharedTripIds.has(trip.id))
      .map((trip) => trip.id);
    if (
      selectedTripIds.length === nonSharedTripIds.length &&
      nonSharedTripIds.length > 0 &&
      selectedTripIds.every((id) => nonSharedTripIds.includes(id))
    ) {
      setSelectedTripIds([]);
    } else {
      setSelectedTripIds(nonSharedTripIds);
    }
  }

  // Bulk duplicate handler
  function handleBulkDuplicate() {
    nonSharedSelectedTrips.forEach((trip) => duplicateTrip(trip));
  }

  // Bulk delete handler
  async function handleBulkDelete() {
    for (const trip of nonSharedSelectedTrips) {
      await removeTrip(trip.id);
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

  // Update filter handler
  const handleUpdateFilter = (key: string, value: unknown) => {
    if (key in filters) {
      updateFilter(
        key as keyof TripFilterState,
        value as TripFilterState[keyof TripFilterState],
      );
    }
  };

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
          setCalendarOpen={toggleCalendar}
          onAddTrip={handleAdd}
          onBulkDuplicate={handleBulkDuplicate}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Table area */}
      <div className="flex-1 w-full mx-auto flex flex-col">
        <TripModal
          key={trip?.id ?? "new-trip"}
          isOpen={modalOpen}
          trip={trip}
          onChange={setTrip}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          isEditing={!!trip && !!trip.id}
        />
        {loading ? (
          <LoadingSpinner
            fullScreen
            message={t("loading", "Loading trips...")}
          />
        ) : trips.length === 0 ? (
          <div className="flex flex-1 items-center justify-center min-h-[300px] text-muted text-lg">
            {t("noTrips", "No trips yet.")}
          </div>
        ) : (
          <>
            <TripsTable
              trips={paginatedTrips}
              onViewInCalendar={handleViewInCalendar}
              onEdit={handleEdit}
              onDuplicate={duplicateTrip}
              onRatingChange={updateTripRating}
              onDelete={handleDelete}
              filters={filters}
              updateFilter={handleUpdateFilter}
              countryOptions={countryOptions}
              yearOptions={yearOptions}
              participantsOptions={participantsOptions}
              categoryOptions={categoryOptions}
              statusOptions={statusOptions}
              tagOptions={tagOptions}
              selectedTripIds={selectedTripIds}
              onSelectTrip={handleSelectTrip}
              allSelected={allSelected}
              handleSelectAll={handleSelectAll}
              showRowNumbers={showRowNumbers}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              totalCount={totalTripsCount}
              onPageSizeChange={setPageSize}
              sortBy={sortBy}
              onSort={setSortBy}
            />
          </>
        )}
      </div>
    </div>
  );
}
