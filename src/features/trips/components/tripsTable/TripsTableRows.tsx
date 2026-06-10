import { Checkbox, StarRatingInput, TableCell } from "@components";
import { ICONS } from "@constants/icons";
import { createCountryMap, type Country } from "@features/countries";
import { formatDate } from "@utils/date";
import { TripActions } from "./TripActions";
import { CategoriesList } from "../common/CategoriesList";
import { TripCountriesList } from "../common/TripCountriesList";
import { ParticipantsList } from "../common/ParticipantsList";
import { TagsList } from "../common/TagsList";
import { TripStatusChip } from "../common/TripStatusChip";
import type { Trip, TripStatus } from "../../types";

interface TripsTableRowsProps {
  trip: Trip;
  tripIdx: number;
  countryData: { countries: Country[] };
  selected: boolean;
  onSelect: (id: string) => void;
  onRatingChange: (tripId: string, rating: number | undefined) => void;
  onViewInCalendar?: (t: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDuplicate: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  showRowNumbers: boolean;
}

const TRIP_STATUS_BORDER_CLASSES: Record<TripStatus, string> = {
  planned: "border-l-4 border-l-status-planned",
  upcoming: "border-l-4 border-l-status-upcoming",
  "in-progress": "border-l-4 border-l-status-inprogress",
  completed: "border-l-4 border-l-input",
  cancelled: "border-l-4 border-l-status-cancelled",
};

export function TripsTableRows({
  trip,
  tripIdx,
  countryData,
  selected,
  onSelect,
  onRatingChange,
  onViewInCalendar,
  onEdit,
  onDuplicate,
  onDelete,
  showRowNumbers,
}: TripsTableRowsProps) {
  const rowSpan = trip.countryCodes?.length || 1;

  // Country lookup for fast access
  const countryLookup = createCountryMap(countryData.countries, (c) => c);

  // Map and sort countries for consistent display order
  const mappedCountries = (trip.countryCodes ?? []).map((code) => {
    const country =
      code && countryLookup ? countryLookup[code.toLowerCase()] : null;
    return { code, country };
  });

  // Sort countries alphabetically by name (or code if name is missing)
  const sortedCountries = mappedCountries.sort((a, b) => {
    const nameA = a.country?.name ?? a.code;
    const nameB = b.country?.name ?? b.code;
    return nameA.localeCompare(nameB);
  });

  return sortedCountries.map(({ code, country }, idx) => {
    return (
      <tr
        key={trip.id + "-" + code}
        className={[
          tripIdx % 2 === 0 ? "bg-table-row" : "bg-table-row-alt",
          TRIP_STATUS_BORDER_CLASSES[trip.status ?? "planned"],
          "group",
        ].join(" ")}
      >
        {idx === 0 && (
          <>
            {/* Number */}
            <TableCell rowSpan={rowSpan}>
              {showRowNumbers ? tripIdx + 1 : null}
            </TableCell>

            {/* Checkbox */}
            <TableCell rowSpan={rowSpan}>
              <Checkbox
                checked={selected}
                onChange={() => onSelect(trip.id)}
                aria-label={`Select trip ${trip.name}`}
              />
            </TableCell>

            {/* Name */}
            <TableCell rowSpan={rowSpan}>
              {trip.favorite && (
                <ICONS.favorite className="h-5 w-5 inline text-danger me-2" />
              )}
              {trip.name}
            </TableCell>

            {/* Rating */}
            <TableCell rowSpan={rowSpan}>
              <StarRatingInput
                value={typeof trip.rating === "number" ? trip.rating : 0}
                onChange={(rating) => onRatingChange(trip.id, rating)}
              />
            </TableCell>
          </>
        )}

        {/* Countries */}
        <TableCell
          className={`py-2 ${idx === 0} ${
            idx === (trip.countryCodes?.length ?? 1) - 1
          }`}
        >
          {country && (
            <TripCountriesList
              countries={[{ isoCode: country.isoCode, name: country.name }]}
            />
          )}
        </TableCell>

        {idx === 0 && (
          <>
            {/* Dates */}
            <TableCell rowSpan={rowSpan}>
              {trip.startDate ? new Date(trip.startDate).getFullYear() : "TBD"}
            </TableCell>
            <TableCell rowSpan={rowSpan}>
              {trip.startDate ? formatDate(trip.startDate) : "TBD"}
            </TableCell>
            <TableCell rowSpan={rowSpan}>
              {trip.endDate ? formatDate(trip.endDate) : "TBD"}
            </TableCell>
            <TableCell rowSpan={rowSpan}>
              {trip.startDate && trip.endDate ? trip.fullDays : "TBD"}
            </TableCell>

            {/* Participants */}
            <TableCell rowSpan={rowSpan}>
              <ParticipantsList uids={trip.participants ?? []} />
            </TableCell>

            {/* Categories */}
            <TableCell rowSpan={rowSpan}>
              <CategoriesList categories={trip.categories ?? []} />
            </TableCell>

            {/* Status */}
            <TableCell rowSpan={rowSpan}>
              <TripStatusChip status={trip.status} />
            </TableCell>

            {/* Tags */}
            <TableCell rowSpan={rowSpan}>
              <TagsList tags={trip.tags ?? []} />
            </TableCell>

            {/* Actions */}
            <TableCell rowSpan={rowSpan}>
              <TripActions
                trip={trip}
                onViewInCalendar={onViewInCalendar}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            </TableCell>
          </>
        )}
      </tr>
    );
  });
}
