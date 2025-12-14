import { FaHeart } from "react-icons/fa6";
import { Checkbox, ChipList, StarRatingInput, TableCell } from "@components";
import { CountryWithFlag, createCountryMap } from "@features/countries";
import { TRIP_CATEGORY_ICONS } from "@features/trips/constants/tripCategoryIcons";
import { isUpcomingTrip } from "@features/trips/utils/trips";
import type { Trip } from "@types";
import { formatDate } from "@utils/date";
import { StatusCell } from "./StatusCell";
import { TripActions } from "./TripActions";

interface TripsTableRowsProps {
  trip: Trip;
  tripIdx: number;
  countryData: any;
  selected: boolean;
  onSelect: (id: string) => void;
  onRatingChange: (tripId: string, rating: number | undefined) => void;
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
        className={[
          tripIdx % 2 === 0
            ? "bg-table-row"
            : "bg-table-row-alt",
          isUpcomingTrip(trip) ? "bg-table-row-upcoming" : "",
          "group",
        ].join(" ")}
      >
        {idx === 0 && (
          <>
            {/* Number column */}
            <TableCell rowSpan={rowSpan}>
              {showRowNumbers ? tripIdx + 1 : null}
            </TableCell>

            {/* Checkbox column */}
            <TableCell rowSpan={rowSpan}>
              <Checkbox
                checked={selected}
                onChange={() => onSelect(trip.id)}
                aria-label={`Select trip ${trip.name}`}
              />
            </TableCell>

            {/* Name column */}
            <TableCell rowSpan={rowSpan}>
              {trip.favorite && (
                <FaHeart className="h-5 w-5 inline text-danger mr-2" />
              )}
              {trip.name}
            </TableCell>

            {/* Rating column */}
            <TableCell rowSpan={rowSpan}>
              <StarRatingInput
                value={typeof trip.rating === "number" ? trip.rating : 0}
                onChange={(rating) => onRatingChange(trip.id, rating)}
              />
            </TableCell>
          </>
        )}

        {/* Countries column */}
        <TableCell
          className={`py-2 ${idx === 0} ${
            idx === (trip.countryCodes?.length ?? 1) - 1
          }`}
        >
          {country ? (
            <CountryWithFlag isoCode={country.isoCode} name={country.name} />
          ) : code ? (
            <span>{code}</span>
          ) : (
            <span className="text-muted italic">No country</span>
          )}
        </TableCell>
        {idx === 0 && (
          <>
            {/* Dates */}
            <TableCell rowSpan={rowSpan}>
              {trip.startDate ? new Date(trip.startDate).getFullYear() : ""}
            </TableCell>
            <TableCell rowSpan={rowSpan}>
              {formatDate(trip.startDate)}
            </TableCell>
            <TableCell rowSpan={rowSpan}>{formatDate(trip.endDate)}</TableCell>
            <TableCell rowSpan={rowSpan}>{trip.fullDays}</TableCell>

            {/* Categories */}
            <TableCell rowSpan={rowSpan}>
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
            <TableCell rowSpan={rowSpan}>
              <StatusCell status={trip.status} />
            </TableCell>

            {/* Tags */}
            <TableCell rowSpan={rowSpan}>
              <ChipList
                items={trip.tags}
                colorClass="bg-purple-100 text-purple-800"
                moreColorClass="bg-purple-200 text-purple-900"
              />
            </TableCell>

            {/* Actions */}
            <TableCell rowSpan={rowSpan}>
              <TripActions trip={trip} onEdit={onEdit} onDelete={onDelete} />
            </TableCell>
          </>
        )}
      </tr>
    );
  });
}
