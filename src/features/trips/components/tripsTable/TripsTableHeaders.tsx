import type { JSX } from "react";
import {
  Checkbox,
  DropdownSelectInput,
  SortableFilterHeader,
  StarRatingInput,
} from "@components";
import { CountryWithFlag } from "@features/countries";
import { TRIP_CATEGORY_ICONS } from "@features/trips/constants/tripCategoryIcons";
import type {
  TripFilters,
  TripSortBy,
  TripSortByKey,
} from "@features/trips/types";
import type { TripCategory } from "@types";
import { RATING_OPTIONS } from "@features/trips/constants/trips";

interface TripsTableHeadersProps {
  allSelected: boolean;
  handleSelectAll: () => void;
  sortBy: TripSortBy;
  handleSort: (key: TripSortByKey) => void;
  filters: TripFilters;
  updateFilter: (key: string, value: any) => void;
  countryOptions: any[];
  yearOptions: any[];
  categoryOptions: any[];
  statusOptions: any[];
  tagOptions: any[];
  renderResizeHandle: (key: string) => JSX.Element;
  showRowNumbers: boolean;
}

export function TripsTableHeaders({
  allSelected,
  handleSelectAll,
  sortBy,
  handleSort,
  filters,
  updateFilter,
  countryOptions,
  yearOptions,
  categoryOptions,
  statusOptions,
  tagOptions,
  renderResizeHandle,
  showRowNumbers,
}: TripsTableHeadersProps) {
  return (
    <thead>
      <tr>
        {showRowNumbers ? (
          <th className="trips-th-unsortable">#{renderResizeHandle("idx")}</th>
        ) : (
          <th className="trips-th-unsortable" />
        )}
        <th className="trips-th-unsortable">
          <Checkbox
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Select all trips"
          />
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Name"
            sortKey="name"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterValue={filters.name}
            placeholder="Search by name..."
          />
          {renderResizeHandle("name")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Rating"
            sortKey="rating"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput<number>
                value={typeof filters.rating === "number" ? filters.rating : []}
                onChange={(v) => updateFilter("rating", v)}
                options={RATING_OPTIONS}
                placeholder="All Ratings"
                className="trips-filter-dropdown"
                renderOption={(opt) => (
                  <span className="flex items-center gap-2">
                    {opt.value === -1 ? (
                      <span />
                    ) : (
                      <StarRatingInput value={opt.value} readOnly />
                    )}
                    <span className="text-xs text-gray-500">{opt.label}</span>
                  </span>
                )}
              />
            }
          />
          {renderResizeHandle("rating")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Countries"
            sortKey="countries"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput<string>
                value={filters.country}
                onChange={(v) =>
                  updateFilter("country", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={countryOptions}
                placeholder="All Countries"
                isMulti
                className="trips-filter-dropdown"
                renderOption={(opt) =>
                  opt.country ? (
                    <CountryWithFlag
                      isoCode={opt.value}
                      name={opt.country.name}
                    />
                  ) : (
                    opt.label
                  )
                }
              />
            }
          />
          {renderResizeHandle("countries")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Year"
            sortKey="year"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput<string>
                value={filters.year}
                onChange={(v) =>
                  updateFilter("year", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={yearOptions}
                placeholder="All Years"
                isMulti
                className="trips-filter-dropdown"
              />
            }
          />
          {renderResizeHandle("year")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Start Date"
            sortKey="startDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
          {renderResizeHandle("startDate")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="End Date"
            sortKey="endDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
          {renderResizeHandle("endDate")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Full Days"
            sortKey="fullDays"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
          {renderResizeHandle("fullDays")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Categories"
            sortKey="categories"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput<TripCategory>
                value={filters.categories}
                onChange={(v) =>
                  updateFilter(
                    "categories",
                    Array.isArray(v) ? v : v ? [v] : []
                  )
                }
                options={categoryOptions}
                placeholder="All Categories"
                isMulti
                className="trips-filter-dropdown"
                renderOption={(opt) => (
                  <span className="flex items-center gap-2">
                    {TRIP_CATEGORY_ICONS[opt.value] ?? null}
                    <span>{opt.label}</span>
                  </span>
                )}
              />
            }
          />
          {renderResizeHandle("categories")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Status"
            sortKey="status"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput
                value={filters.status}
                onChange={(v) =>
                  updateFilter("status", Array.isArray(v) ? v[0] : v)
                }
                options={statusOptions}
                placeholder="All Statuses"
                className="trips-filter-dropdown"
              />
            }
          />
          {renderResizeHandle("status")}
        </th>
        <th className="trips-th">
          <SortableFilterHeader
            label="Tags"
            sortKey="tags"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <DropdownSelectInput
                value={filters.tags}
                onChange={(v) =>
                  updateFilter("tags", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={tagOptions}
                placeholder="All Tags"
                isMulti
                className="trips-filter-dropdown"
              />
            }
          />
          {renderResizeHandle("tags")}
        </th>
        <th className="trips-th-unsortable">
          Actions
          {renderResizeHandle("actions")}
        </th>
      </tr>
    </thead>
  );
}
