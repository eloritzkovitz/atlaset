import type { JSX } from "react";
import {
  Checkbox,
  SortableFilterHeader,
  StarRatingInput,
  TableDropdownFilter,
  TableHeader,
} from "@components";
import { CountryWithFlag } from "@features/countries";
import { TRIP_CATEGORY_ICONS } from "@features/trips/constants/tripCategoryIcons";
import {
  ALL_TRIP_CATEGORIES,
  RATING_OPTIONS,
} from "@features/trips/constants/trips";
import type { FilterOption } from "@types";
import { isAllowedOption, isStringOption } from "@utils/dropdown";
import type {
  TripCategory,
  TripFilters,
  TripSortBy,
  TripSortByKey,
} from "../../types";

interface TripsTableHeadersProps {
  allSelected: boolean;
  handleSelectAll: () => void;
  sortBy: TripSortBy;
  handleSort: (key: TripSortByKey) => void;
  filters: TripFilters;
  updateFilter: (key: string, value: unknown) => void;
  countryOptions: FilterOption[];
  yearOptions: FilterOption[];
  categoryOptions: FilterOption[];
  statusOptions: FilterOption[];
  tagOptions: FilterOption[];
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
          <TableHeader unsortable>#{renderResizeHandle("idx")}</TableHeader>
        ) : (
          <TableHeader unsortable />
        )}
        <TableHeader unsortable>
          <Checkbox
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Select all trips"
          />
        </TableHeader>
        <TableHeader colKey="name" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Name"
            sortKey="name"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterValue={filters.name}
            placeholder="Search by name..."
          />
        </TableHeader>
        <TableHeader colKey="rating" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Rating"
            sortKey="rating"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<number>
                value={typeof filters.rating === "number" ? filters.rating : []}
                onChange={(v) => updateFilter("rating", v)}
                options={RATING_OPTIONS}
                placeholder="All Ratings"
                renderOption={(opt) =>
                  "value" in opt ? (
                    <span className="flex items-center gap-2">
                      {opt.value === -1 ? (
                        <span />
                      ) : (
                        <StarRatingInput value={opt.value} readOnly />
                      )}
                      <span className="text-xs text-muted">{opt.label}</span>
                    </span>
                  ) : null
                }
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="countries" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Countries"
            sortKey="countries"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<string>
                value={filters.country}
                onChange={(v) =>
                  updateFilter("country", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={countryOptions.filter(isStringOption)}
                placeholder="All Countries"
                isMulti
                renderOption={(opt) =>
                  "country" in opt &&
                  "value" in opt &&
                  opt.country &&
                  typeof opt.country === "object" &&
                  "name" in opt.country &&
                  typeof opt.country.name === "string" ? (
                    <CountryWithFlag
                      isoCode={opt.value}
                      name={opt.country.name}
                    />
                  ) : "label" in opt ? (
                    opt.label
                  ) : null
                }
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="year" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Year"
            sortKey="year"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<string>
                value={filters.year}
                onChange={(v) =>
                  updateFilter("year", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={yearOptions.filter(isStringOption)}
                placeholder="All Years"
                isMulti
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="startDate" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Start Date"
            sortKey="startDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader colKey="endDate" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="End Date"
            sortKey="endDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader colKey="fullDays" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Full Days"
            sortKey="fullDays"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader
          colKey="categories"
          renderResizeHandle={renderResizeHandle}
        >
          <SortableFilterHeader
            label="Categories"
            sortKey="categories"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<TripCategory>
                value={filters.categories}
                onChange={(v) =>
                  updateFilter(
                    "categories",
                    Array.isArray(v) ? v : v ? [v] : []
                  )
                }
                options={categoryOptions.filter((opt) =>
                  isAllowedOption(opt, ALL_TRIP_CATEGORIES)
                )}
                placeholder="All Categories"
                isMulti
                renderOption={(opt) =>
                  "value" in opt ? (
                    <span className="flex items-center gap-2">
                      {TRIP_CATEGORY_ICONS[opt.value] ?? null}
                      <span>{opt.label}</span>
                    </span>
                  ) : null
                }
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="status" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Status"
            sortKey="status"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter
                value={filters.status}
                onChange={(v) =>
                  updateFilter("status", Array.isArray(v) ? v[0] : v)
                }
                options={statusOptions}
                placeholder="All Statuses"
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="tags" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label="Tags"
            sortKey="tags"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter
                value={filters.tags}
                onChange={(v) =>
                  updateFilter("tags", Array.isArray(v) ? v : v ? [v] : [])
                }
                options={tagOptions}
                placeholder="All Tags"
                isMulti
              />
            }
          />
        </TableHeader>
        <TableHeader
          unsortable
          colKey="actions"
          renderResizeHandle={renderResizeHandle}
        ></TableHeader>
      </tr>
    </thead>
  );
}
