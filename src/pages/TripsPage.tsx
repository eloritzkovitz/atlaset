import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "@components";
import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import {
  sortTrips,
  TripModal,
  TripsTable,
  TripsToolbar,
  useTripFilters,
  useTripModal,
  type TripFilterState,
  type TripSortBy,
} from "@features/trips";
import { usePageTitle, useScreenSize, useTablePagination } from "@hooks";

export default function TripsPage() {
  const countryData = useCountryData();
  const { isMobile } = useScreenSize();
  const { trips, loading } = useTrips();
  const { t } = useTranslation("trips");

  const [globalSearch, setGlobalSearch] = useState("");
  const [sortBy, setSortBy] = useState<TripSortBy>("startDate-desc");

  usePageTitle(t("pageTitle", "Trips"));

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

  const sortedTrips = sortTrips(
    filteredTrips,
    countryData?.countries ?? [],
    sortBy,
  );

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

  const {
    trip,
    setTrip,
    modalOpen,
    setModalOpen,
    handleAdd,
    handleEdit,
    handleSave,
  } = useTripModal();

  // Update filter handler
  const handleUpdateFilter = (key: string, value: unknown) => {
    if (key in filters) {
      updateFilter(
        key as keyof TripFilterState,
        value as TripFilterState[keyof TripFilterState],
      );
    }
  };

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
          onAddTrip={handleAdd}
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
              onEdit={handleEdit}
              filters={filters}
              updateFilter={handleUpdateFilter}
              countryOptions={countryOptions}
              yearOptions={yearOptions}
              participantsOptions={participantsOptions}
              categoryOptions={categoryOptions}
              statusOptions={statusOptions}
              tagOptions={tagOptions}
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
