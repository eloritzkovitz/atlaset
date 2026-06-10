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
import type { Trip } from "../../types";

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
}

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
}: TripsTableRowsProps) {
  const rowSpan = trip.countryCodes?.length || 1;

  // Country lookup for fast access
  const countryLookup = createCountryMap(countryData.countries, (c) => c);

  // Map and sort countries for consistent display order
  const mappedCountries = (trip.countryCodes ?? []).map((code) => {
    const country =
      code && countryLookup ? countryLookup[code.toLowerCase()] : null;
    return { isoCode: code, name: country?.name ?? code };
  });

  // Sort countries alphabetically by name
  const sortedCountries = mappedCountries.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <tr
      className={[
        tripIdx % 2 === 0 ? "bg-table-row" : "bg-table-row-alt",
        "group",
      ].join(" ")}
    >
      <>
        {/* Select */}
        <TableCell rowSpan={rowSpan} className="relative pl-5">
          <div
            className={`
              absolute left-0 top-0 bottom-0 w-1
              ${trip.status === "planned" ? "bg-status-planned" : ""}
              ${trip.status === "upcoming" ? "bg-status-upcoming" : ""}
              ${trip.status === "in-progress" ? "bg-status-in-progress" : ""}
            `}
          />
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

        {/* Countries */}
        <TableCell className="py-2">
          {sortedCountries.length > 0 && (
            <TripCountriesList countries={sortedCountries} />
          )}
        </TableCell>

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
    </tr>
  );
}
