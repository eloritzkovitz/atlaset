import { Checkbox, ChipList, StarRatingInput } from "@components";
import { CountryWithFlag, createCountryMap } from "@features/countries";
import { type ColumnKey } from "@features/trips/constants/columns";
import { TRIP_CATEGORY_ICONS } from "@features/trips/constants/tripCategoryIcons";
import type { Trip } from "@types";
import { formatDate } from "@utils/date";
import { StatusCell } from "./StatusCell";
import { TableCell } from "./TableCell";
import { TripActions } from "./TripActions";
import { FaHeart } from "react-icons/fa6";

interface TripsTableRowsProps {
  trip: Trip;
  tripIdx: number;
  countryData: any;
  selected: boolean;
  onSelect: (id: string) => void;
  onRatingChange: (tripId: string, rating: number | undefined) => void;
  getTripRowClass: (trip: Trip, tripIdx: number) => string;
  handleResizeStart: (e: React.MouseEvent, key: ColumnKey) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  showRowNumbers: boolean;
}

export function TripsTableRows({
  trip,
  tripIdx,
  countryData,
  selected,
  onSelect,
  onRatingChange,
  getTripRowClass,
  handleResizeStart,
  onEdit,
  onDelete,
  showRowNumbers,
}: TripsTableRowsProps) {
  const rowSpan = trip.countryCodes?.length || 1;

  // Country lookup for fast access
  const countryLookup = createCountryMap(countryData.countries, (c) => c);

  return (
    trip.countryCodes && trip.countryCodes.length > 0
      ? trip.countryCodes
      : [undefined]
  ).map((code, idx) => {
    const country =
      code && countryLookup ? countryLookup[code.toLowerCase()] : null;

    return (
      <tr
        key={trip.id + "-" + (code || idx)}
        className={`${getTripRowClass(trip, tripIdx)} group`}
      >
        {idx === 0 && (
          <>
            {/* Number column */}
            <TableCell
              columnKey="idx"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {showRowNumbers ? tripIdx + 1 : null}
            </TableCell>
            {/* Checkbox column */}
            <TableCell
              columnKey="select"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              <Checkbox
                checked={selected}
                onChange={() => onSelect(trip.id)}
                aria-label={`Select trip ${trip.name}`}
              />
            </TableCell>
            {/* Name column */}
            <TableCell
              columnKey="name"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {trip.favorite && (
                <FaHeart className="h-5 w-5 inline text-red-400 mr-2" />
              )}
              {trip.name}
            </TableCell>
            <TableCell
              columnKey="rating"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              <StarRatingInput
                value={typeof trip.rating === "number" ? trip.rating : 0}
                onChange={(rating) => onRatingChange(trip.id, rating)}
              />
            </TableCell>
          </>
        )}
        {/* Countries column */}
        <TableCell
          columnKey="countries"
          className={`trips-td-middle ${idx === 0 ? "trips-td-top" : ""} ${
            idx === (trip.countryCodes?.length ?? 1) - 1
              ? "trips-td-bottom"
              : ""
          }`}
          handleResizeStart={handleResizeStart}
        >
          {country ? (
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
          ) : code ? (
            <span>{code}</span>
          ) : (
            <span className="text-gray-400 italic">No country</span>
          )}
        </TableCell>
        {idx === 0 && (
          <>
            {/* Year */}
            <TableCell
              columnKey="year"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {trip.startDate ? new Date(trip.startDate).getFullYear() : ""}
            </TableCell>
            {/* Start Date */}
            <TableCell
              columnKey="startDate"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {formatDate(trip.startDate)}
            </TableCell>
            {/* End Date */}
            <TableCell
              columnKey="endDate"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {formatDate(trip.endDate)}
            </TableCell>
            {/* Full Days */}
            <TableCell
              columnKey="fullDays"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              {trip.fullDays}
            </TableCell>
            {/* Categories */}
            <TableCell
              columnKey="categories"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              <ChipList<{ value: string; label: string }>
                items={(trip.categories ?? []).map((cat) => ({
                  value: cat,
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                }))}
                renderItem={(opt) => (
                  <span className="flex items-center gap-1" key={opt.value}>
                    {TRIP_CATEGORY_ICONS[opt.value] ?? null}
                    <span>{opt.label}</span>
                  </span>
                )}
              />
            </TableCell>
            {/* Status */}
            <TableCell
              columnKey="status"
              rowSpan={rowSpan}
              className="trips-td p-0"
              handleResizeStart={handleResizeStart}
            >
              <StatusCell status={trip.status} />
            </TableCell>
            {/* Tags */}
            <TableCell
              columnKey="tags"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              <ChipList
                items={trip.tags}
                colorClass="bg-purple-100 text-purple-800"
                moreColorClass="bg-purple-200 text-purple-900"
              />
            </TableCell>
            {/* Actions */}
            <TableCell
              columnKey="actions"
              rowSpan={rowSpan}
              handleResizeStart={handleResizeStart}
            >
              <TripActions trip={trip} onEdit={onEdit} onDelete={onDelete} />
            </TableCell>
          </>
        )}
      </tr>
    );
  });
}
