import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
  Checkbox,
  getRatingOptions,
  SortableFilterHeader,
  StarRatingInput,
  TableDropdownFilter,
  TableHeader,
} from "@components";
import { CountryWithFlag, type Country } from "@features/countries";
import type { FilterOption, Option } from "@types";
import { isAllowedOption, isStringOption } from "@utils";
import { TRIP_CATEGORY_ICONS } from "../../constants/tripCategoryIcons";
import { ALL_TRIP_CATEGORIES } from "../../constants/trips";
import { useTrips } from "../../context/TripsContext";
import type {
  Trip,
  TripCategory,
  TripFilters,
  TripSortBy,
  TripSortByKey,
} from "../../types";

interface TripsTableHeadersProps {
  trips: Trip[];
  sortBy: TripSortBy;
  handleSort: (key: TripSortByKey) => void;
  filters: TripFilters;
  updateFilter: (key: string, value: unknown) => void;
  countryOptions: FilterOption[];
  countryByIsoCode: { [isoCode: string]: Country };
  yearOptions: FilterOption[];
  participantsOptions: Option<string, string>[];
  categoryOptions: FilterOption[];
  statusOptions: FilterOption[];
  tagOptions: FilterOption[];
  renderResizeHandle: (key: string) => JSX.Element;
}

export function TripsTableHeaders({
  trips,
  sortBy,
  handleSort,
  filters,
  updateFilter,
  countryOptions,
  countryByIsoCode,
  yearOptions,
  participantsOptions,
  categoryOptions,
  statusOptions,
  tagOptions,
  renderResizeHandle,
}: TripsTableHeadersProps) {
  const { isAllSelected, selectAllTrips } = useTrips();
  const { t } = useTranslation("trips");
  const { t: tCommon } = useTranslation("common");

  return (
    <thead>
      <tr>
        <TableHeader colKey="select" unsortable className="relative ps-5">
          <Checkbox
            checked={isAllSelected(trips)}
            onChange={() => selectAllTrips(trips.map((t) => t.id))}
          />
        </TableHeader>
        <TableHeader colKey="name" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.name")}
            sortKey="name"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterValue={filters.name}
            placeholder={t("table.placeholders.searchByName")}
          />
        </TableHeader>
        <TableHeader colKey="rating" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.rating")}
            sortKey="rating"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<number>
                value={typeof filters.rating === "number" ? filters.rating : []}
                onChange={(v) => updateFilter("rating", v)}
                options={getRatingOptions(tCommon)}
                placeholder={t("table.placeholders.allRatings")}
                renderOption={(opt) =>
                  "value" in opt ? (
                    <span className="flex items-center gap-2">
                      {opt.value > -1 ? (
                        <StarRatingInput value={opt.value} readOnly />
                      ) : null}
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
            label={t("table.headers.countries")}
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
                placeholder={t("table.placeholders.allCountries")}
                isMulti
                renderOption={(opt) => {
                  if (!("value" in opt)) return opt.label;

                  const country = countryByIsoCode[opt.value];

                  return country ? (
                    <CountryWithFlag country={country} />
                  ) : (
                    opt.label
                  );
                }}
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="year" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.year")}
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
                placeholder={t("table.placeholders.allYears")}
                isMulti
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="startDate" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.startDate")}
            sortKey="startDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader colKey="endDate" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.endDate")}
            sortKey="endDate"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader colKey="fullDays" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.fullDays")}
            sortKey="fullDays"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
          />
        </TableHeader>
        <TableHeader
          colKey="participants"
          renderResizeHandle={renderResizeHandle}
        >
          <SortableFilterHeader
            label={t("table.headers.participants")}
            sortKey="participants"
            sortBy={sortBy}
            onSort={handleSort}
            filterable
            filterElement={
              <TableDropdownFilter<string>
                value={filters.participants}
                onChange={(v) =>
                  updateFilter(
                    "participants",
                    Array.isArray(v) ? v : v ? [v] : [],
                  )
                }
                options={participantsOptions}
                placeholder={t("table.placeholders.allParticipants")}
                isMulti
                renderOption={(opt) =>
                  "label" in opt ? <span>{opt.label}</span> : null
                }
              />
            }
          />
        </TableHeader>
        <TableHeader
          colKey="categories"
          renderResizeHandle={renderResizeHandle}
        >
          <SortableFilterHeader
            label={t("table.headers.categories")}
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
                    Array.isArray(v) ? v : v ? [v] : [],
                  )
                }
                options={categoryOptions.filter((opt) =>
                  isAllowedOption(opt, ALL_TRIP_CATEGORIES),
                )}
                placeholder={t("table.placeholders.allCategories")}
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
            label={t("table.headers.status")}
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
                placeholder={t("table.placeholders.allStatuses")}
              />
            }
          />
        </TableHeader>
        <TableHeader colKey="tags" renderResizeHandle={renderResizeHandle}>
          <SortableFilterHeader
            label={t("table.headers.tags")}
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
                placeholder={t("table.placeholders.allTags")}
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
