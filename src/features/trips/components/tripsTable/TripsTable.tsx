import { DEFAULT_SIDEBAR_WIDTH } from "@constants";
import { useCountryData } from "@contexts/CountryDataContext";
import { useIsMobile } from "@hooks/useIsMobile";
import { useResizableColumns } from "@hooks/useResizableColumns";
import { useSort } from "@hooks/useSort";
import type { FilterOption } from "@types";
import { TripsTableHeaders } from "./TripsTableHeaders";
import { TripsTableRows } from "./TripsTableRows";
import {
  DEFAULT_WIDTHS,
  MIN_WIDTHS,
  type ColumnKey,
} from "../../constants/columns";
import type { Trip, TripFilters, TripSortBy, TripSortByKey } from "../../types";
import { sortTrips } from "../../utils/tripSort";
import "./TripsTable.css";

interface TripsTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onRatingChange: (tripId: string, rating: number | undefined) => void;
  onDelete: (trip: Trip) => void;
  filters: TripFilters;
  updateFilter: (key: string, value: unknown) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  categoryOptions: FilterOption[];
  statusOptions: FilterOption[];
  tagOptions: FilterOption[];
  selectedTripIds: string[];
  onSelectTrip: (id: string) => void;
  allSelected: boolean;
  handleSelectAll: () => void;
  showRowNumbers: boolean;
}

export function TripsTable({
  trips,
  onEdit,
  onRatingChange,
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
  const isMobile = useIsMobile();

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
        className="absolute right-0 top-0 w-[6px] h-full cursor-col-resize z-[100] select-none bg-transparent opacity-0"
        onMouseDown={(e) => handleResizeStart(e, colKey)}
      />
    );
  };

  return (
    <div
      className="overflow-x-auto w-full"
      style={{
        maxHeight: "93vh",
        overflowY: "auto",
        paddingLeft: !isMobile ? `${DEFAULT_SIDEBAR_WIDTH}px` : 0,
      }}
    >
      <table className="min-w-full w-full bg-surface">
        <colgroup>
          <col style={{ width: `${colWidths.idx}px` }} />
          <col style={{ width: `${colWidths.select}px` }} />
          <col style={{ width: `${colWidths.name}px` }} />
          <col style={{ width: `${colWidths.rating}px` }} />
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
          updateFilter={updateFilter}
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
              key={trip.id}
              trip={trip}
              tripIdx={tripIdx}
              countryData={countryData}
              selected={selectedTripIds.includes(trip.id)}
              onSelect={onSelectTrip}
              onRatingChange={onRatingChange}
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
