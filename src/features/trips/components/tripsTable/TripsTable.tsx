import { useCountryData } from "@contexts/CountryDataContext";
import {
  DEFAULT_WIDTHS,
  MIN_WIDTHS,
  type ColumnKey,
} from "@features/trips/constants/columns";
import type { TripSortBy, TripSortByKey } from "@features/trips/types";
import { getTripRowClass } from "@features/trips/utils/trips";
import { sortTrips } from "@features/trips/utils/tripSort";
import { useResizableColumns } from "@hooks/useResizableColumns";
import { useSort } from "@hooks/useSort";
import type { Trip } from "@types";
import { TripsTableHeaders } from "./TripsTableHeaders";
import { TripsTableRows } from "./TripsTableRows";
import "./TripsTable.css";

interface TripsTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  filters: any;
  updateFilter: (key: string, value: any) => void;
  countryOptions: any[];
  yearOptions: any[];
  categoryOptions: any[];
  statusOptions: any[];
  tagOptions: any[];
  selectedTripIds: string[];
  onSelectTrip: (id: string) => void;
  allSelected: boolean;
  handleSelectAll: () => void;
  showRowNumbers: boolean;
}

export function TripsTable({
  trips,
  onEdit,
  onDelete,
  filters,
  updateFilter,
  countryOptions,
  yearOptions,
  categoryOptions,
  statusOptions,
  tagOptions,
  selectedTripIds,
  onSelectTrip,
  allSelected,
  handleSelectAll,
  showRowNumbers,
}: TripsTableProps) {
  const countryData = useCountryData();

  // Resizable columns
  const { colWidths, handleResizeStart } = useResizableColumns<ColumnKey>(
    DEFAULT_WIDTHS,
    MIN_WIDTHS
  );

  const {
    sortBy,
    setSortBy,
    sortedItems: sortedTrips,
  } = useSort<Trip, TripSortBy>(
    trips ?? [],
    (items, sortBy) => sortTrips(items, countryData.countries, sortBy),
    "startDate-asc"
  );

  // Header click handler
  const handleSort = (key: TripSortByKey) => {
    const [currentKey, currentDir] = sortBy.split("-");
    setSortBy(
      (currentKey === key && currentDir === "asc"
        ? `${key}-desc`
        : `${key}-asc`) as TripSortBy
    );
  };

  // Helper to render resize handle
  const renderResizeHandle = (key: string) => {
    const colKey = key as keyof typeof colWidths;
    return (
      <div
        className="trips-resize-handle"
        onMouseDown={(e) => handleResizeStart(e, colKey)}
      />
    );
  };

  return (
    <div
      className="overflow-x-auto w-full"
      style={{ maxHeight: "93vh", overflowY: "auto" }}
    >
      <table className="trips-table w-full">
        <colgroup>
          <col style={{ width: `${colWidths.idx}px` }} />
          <col style={{ width: `${colWidths.select}px` }} />
          <col style={{ width: `${colWidths.name}px` }} />
          <col style={{ width: `${colWidths.countries}px` }} />
          <col style={{ width: `${colWidths.year}px` }} />
          <col style={{ width: `${colWidths.startDate}px` }} />
          <col style={{ width: `${colWidths.endDate}px` }} />
          <col style={{ width: `${colWidths.fullDays}px` }} />
          <col style={{ width: `${colWidths.categories}px` }} />
          <col style={{ width: `${colWidths.status}px` }} />
          <col style={{ width: `${colWidths.tags}px` }} />
          <col style={{ width: `${colWidths.actions}px` }} />
        </colgroup>
        <TripsTableHeaders
          allSelected={allSelected}
          handleSelectAll={handleSelectAll}
          sortBy={sortBy}
          handleSort={handleSort}
          filters={filters}
          updateFilter={updateFilter as (key: string, value: any) => void}
          countryOptions={countryOptions}
          yearOptions={yearOptions}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          tagOptions={tagOptions}
          renderResizeHandle={renderResizeHandle}
          showRowNumbers={showRowNumbers}
        />
        {sortedTrips.map((trip, tripIdx) => (
          <tbody key={trip.id} className="trips-group">
            <TripsTableRows
              trip={trip}
              tripIdx={tripIdx}
              countryData={countryData}
              selected={selectedTripIds.includes(trip.id)}
              onSelect={onSelectTrip}
              getTripRowClass={getTripRowClass}
              handleResizeStart={handleResizeStart}
              onEdit={onEdit}
              onDelete={onDelete}
              showRowNumbers={showRowNumbers}
            />
          </tbody>
        ))}
      </table>
    </div>
  );
}
