import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { EmptyListMessage, LoadingSpinner } from "@components";
import { useCountryData } from "@features/countries";
import { usePageTitle, useScreenSize, useTablePagination } from "@hooks";
import { TripsTable } from "../components/table/TripsTable";
import { TripsToolbar } from "../components/toolbar/TripsToolbar";
import { useTrips } from "../../core/context/TripsContext";
import { useTripFilters } from "../../core/hooks/useTripFilters";
import type {
  TripFilterState,
  TripSortBy,
  TripViewMode,
} from "../../core/types";
import { sortTrips } from "../../core/utils/tripSort";
import { TripModal } from "../../editor/components/TripModal";
import { useTripEditor } from "../../editor/hooks/useTripEditor";

export default function TripsPage() { 
  const [searchParams, setSearchParams] = useSearchParams();

  const { countries } = useCountryData();
  const { isMobile } = useScreenSize();
  const { trips, sharedTripIds, participantTripIds, loading } = useTrips();
  const { t } = useTranslation("trips");

  const [globalSearch, setGlobalSearch] = useState("");
  const [sortBy, setSortBy] = useState<TripSortBy>("startDate-desc");

  usePageTitle(t("pageTitle", "Trips"));

  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);

  const viewMode: TripViewMode =
    searchParams.get("view") === "shared" ? "shared" : "trips";

  const tripsUrl = `/trips${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  const visibleTrips = trips.filter((trip) => {
    if (viewMode === "shared") {
      return sharedTripIds.has(trip.id) && !participantTripIds.has(trip.id);
    }

    return !sharedTripIds.has(trip.id) || participantTripIds.has(trip.id);
  });

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
  } = useTripFilters(visibleTrips, undefined, globalSearch);

  const sortedTrips = sortTrips(filteredTrips, countries ?? [], sortBy);

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
    initialPage: pageFromUrl,
    initialPageSize: 20,
  });

  const {
    isOpen,
    trip,
    mode,
    overrides,
    setTrip,
    handleAdd,
    handleEdit,
    handleCustomize,
    handleSave,
    handleSaveOverrides,
    onClose,
  } = useTripEditor();

  const handleViewModeChange = (mode: TripViewMode) => {
    setSearchParams((params) => {
      if (mode === "shared") {
        params.set("view", "shared");
      } else {
        params.delete("view");
      }

      params.delete("page");

      return params;
    });

    setCurrentPage(1);
  };

  const handleUpdateFilter = (key: string, value: unknown) => {
    if (key in filters) {
      updateFilter(
        key as keyof TripFilterState,
        value as TripFilterState[keyof TripFilterState],
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    setSearchParams((params) => {
      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      return params;
    });
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
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      )}

      {/* Table area */}
      <div className="flex-1 w-full mx-auto flex flex-col">
        <TripModal
          key={trip?.id ?? "new-trip"}
          isOpen={isOpen}
          trip={trip}
          mode={mode}
          overrides={overrides}
          onChange={setTrip}
          onSave={handleSave}
          onSaveOverrides={handleSaveOverrides}
          onClose={onClose}
        />
        {loading ? (
          <LoadingSpinner
            fullScreen
            message={t("loading", "Loading trips...")}
          />
        ) : trips.length === 0 ? (
          <EmptyListMessage message={t("noTrips", "No trips yet.")} />
        ) : (
          <>
            <TripsTable
              trips={paginatedTrips}
              tripsUrl={tripsUrl}
              onEdit={handleEdit}
              onCustomize={handleCustomize}
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
              onPageChange={handlePageChange}
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
