import { useTranslation } from "react-i18next";
import { Pagination } from "@components";
import { DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useCountryData } from "@features/countries";
import { useScreenSize, useResizableColumns } from "@hooks";
import type { FilterOption, Option } from "@types";
import { TripsTableHeaders } from "./TripsTableHeaders";
import { TripsTableRows } from "./TripsTableRows";
import {
  DEFAULT_WIDTHS,
  MIN_WIDTHS,
  type ColumnKey,
} from "../../constants/columns";
import type { Trip, TripFilters, TripSortBy, TripSortByKey } from "../../types";
import "./TripsTable.css";

interface TripsTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  filters: TripFilters;
  updateFilter: (key: string, value: unknown) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  participantsOptions: Option<string, string>[];
  categoryOptions: FilterOption[];
  statusOptions: FilterOption[];
  tagOptions: FilterOption[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
  onPageSizeChange: (size: number) => void;
  sortBy: TripSortBy;
  onSort: (sortBy: TripSortBy) => void;
}

export function TripsTable({
  trips,
  onEdit,
  filters,
  updateFilter,
  countryOptions,
  yearOptions,
  participantsOptions,
  categoryOptions,
  statusOptions,
  tagOptions,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
  onPageSizeChange,
  sortBy,
  onSort,
}: TripsTableProps) {
  const { countryByIsoCode } = useCountryData();
  const { isMobile } = useScreenSize();
  const { t } = useTranslation("trips");

  // Resizable columns
  const { colWidths, handleResizeStart } = useResizableColumns<ColumnKey>(
    DEFAULT_WIDTHS,
    MIN_WIDTHS,
  );

  // Render resize handle for each column
  const renderResizeHandle = (key: string) => {
    const colKey = key as keyof typeof colWidths;
    return (
      <div
        className="absolute end-0 top-0 w-[6px] h-full cursor-col-resize z-[100] select-none bg-transparent opacity-0"
        onMouseDown={(e) => handleResizeStart(e, colKey)}
      />
    );
  };

  // Handle sorting when a column header is clicked
  const handleSort = (key: TripSortByKey) => {
    const [currentKey, currentDir] = sortBy.split("-");
    let nextDir: "asc" | "desc" = "asc";
    if (currentKey === key) {
      nextDir = currentDir === "asc" ? "desc" : "asc";
    }
    onSort(`${key}-${nextDir}` as TripSortBy);
  };

  return (
    <div
      className="overflow-x-auto w-full"
      style={{
        maxHeight: "93vh",
        overflowY: "auto",
        paddingInlineStart: !isMobile ? DEFAULT_SIDEBAR_WIDTH : 0,
      }}
    >
      <table className="min-w-full w-full">
        <colgroup>
          <col style={{ width: `${colWidths.select}px` }} />
          <col style={{ width: `${colWidths.name}px` }} />
          <col style={{ width: `${colWidths.rating}px` }} />
          <col style={{ width: `${colWidths.countries}px` }} />
          <col style={{ width: `${colWidths.year}px` }} />
          <col style={{ width: `${colWidths.startDate}px` }} />
          <col style={{ width: `${colWidths.endDate}px` }} />
          <col style={{ width: `${colWidths.fullDays}px` }} />
          <col style={{ width: `${colWidths.participants}px` }} />
          <col style={{ width: `${colWidths.categories}px` }} />
          <col style={{ width: `${colWidths.status}px` }} />
          <col style={{ width: `${colWidths.tags}px` }} />
          <col style={{ width: `${colWidths.actions}px` }} />
        </colgroup>
        <TripsTableHeaders
          trips={trips}
          sortBy={sortBy}
          handleSort={handleSort}
          filters={filters}
          updateFilter={updateFilter}
          countryOptions={countryOptions}
          countryByIsoCode={countryByIsoCode}
          yearOptions={yearOptions}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          tagOptions={tagOptions}
          participantsOptions={participantsOptions}
          renderResizeHandle={renderResizeHandle}
        />
        {trips.map((trip, tripIdx) => (
          <tbody key={trip.id} className="trips-group">
            <TripsTableRows
              key={trip.id}
              trip={trip}
              tripIdx={tripIdx}
              countryByIsoCode={countryByIsoCode}
              onEdit={onEdit}
            />
          </tbody>
        ))}
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageSizeChange={onPageSizeChange}
        itemLabel={{
          singular: t("table.itemLabels.singular"),
          plural: t("table.itemLabels.plural"),
        }}
      />
    </div>
  );
}
