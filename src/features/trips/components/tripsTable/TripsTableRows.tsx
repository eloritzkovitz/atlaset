import { useTranslation } from "react-i18next";
import { Checkbox, ChipList, StarRatingInput, TableCell } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountryWithFlag,
  createCountryMap,
  type Country,
} from "@features/countries";
import { formatDate } from "@utils/date";
import { capitalizeWords } from "@utils/string";
import { ParticipantsList } from "./ParticipantsList";
import { StatusCell } from "./StatusCell";
import { TripActions } from "./TripActions";
import { TRIP_CATEGORY_ICONS } from "../../constants/tripCategoryIcons";
import type { Trip } from "../../types";
import { isPlannedTrip, isUpcomingTrip } from "../../utils/trips";

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
  const { t } = useTranslation("trips");
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
          isUpcomingTrip(trip)
            ? "bg-table-row-upcoming/80"
            : isPlannedTrip(trip)
              ? "bg-table-row-planned/80"
              : "",
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
                <ICONS.favorite className="h-5 w-5 inline text-danger me-2" />
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
              <ChipList<{ value: string; label: string }>
                items={(trip.categories ?? []).map((cat) => {
                  const fallback = capitalizeWords(cat.replace(/-/g, " "));
                  return {
                    value: cat,
                    label: t(`categories.${cat}`, fallback),
                  };
                })}
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
                items={(trip.tags ?? []).map((tag) => {
                  const fallback = capitalizeWords(tag.replace(/-/g, " "));
                  return { value: tag, label: t(`tags.${tag}`, fallback) };
                })}
                colorClass="bg-purple-100 text-purple-800"
                moreColorClass="bg-purple-200 text-purple-900"
              />
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
