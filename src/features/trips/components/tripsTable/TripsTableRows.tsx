import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, StarRatingInput, TableCell } from "@components";
import { ICONS } from "@constants/icons";
import type { Country } from "@features/countries/types";
import { formatDate } from "@utils";
import { TripActions } from "./TripActions";
import { CategoriesList } from "../common/CategoriesList";
import { TripCountriesList } from "../common/TripCountriesList";
import { ParticipantsList } from "../common/ParticipantsList";
import { TagsList } from "../common/TagsList";
import { TripStatusChip } from "../common/TripStatusChip";
import { useTrips } from "../../context/TripsContext";
import type { Trip } from "../../types";

interface TripsTableRowsProps {
  trip: Trip;
  tripIdx: number;
  countryByIsoCode: { [isoCode: string]: Country };
  onEdit: (trip: Trip) => void;
}

export function TripsTableRows({
  trip,
  tripIdx,
  countryByIsoCode,
  onEdit,
}: TripsTableRowsProps) {
  const { updateTripRating, selectedTripIds, selectTrip } = useTrips();
  const { t } = useTranslation("common");

  const rowSpan = trip.countryCodes?.length || 1;

  // Map and sort countries for consistent display order
  const mappedCountries = (trip.countryCodes ?? []).map((code) => {
    const country = countryByIsoCode[code];

    return {
      isoCode: code,
      name: country?.name ?? code,
    };
  });

  // Sort countries alphabetically by name
  const sortedCountries = mappedCountries.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  // Ref for TripActions to support context menu opening
  const actionsRef = useRef<{
    openAtCoordinates: (x: number, y: number) => void;
  }>(null);

  // Handle right-click to open context menu on TripActions
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (actionsRef.current) {
      actionsRef.current.openAtCoordinates(e.clientX, e.clientY);
    }
  };

  const tbdLabel = t("formatting.date.tbd");

  return (
    <tr
      className={[
        tripIdx % 2 === 0 ? "bg-table-row" : "bg-table-row-alt",
        "group",
      ].join(" ")}
      onContextMenu={handleContextMenu}
    >
      <>
        {/* Select */}
        <TableCell rowSpan={rowSpan} className="relative ps-5">
          <div
            className={`
              absolute start-0 top-0 bottom-0 w-1
              ${trip.status === "planned" ? "bg-status-planned" : ""}
              ${trip.status === "upcoming" ? "bg-status-upcoming" : ""}
              ${trip.status === "in-progress" ? "bg-status-inprogress" : ""}
            `}
          />
          <Checkbox
            checked={selectedTripIds.includes(trip.id)}
            onChange={() => selectTrip(trip.id)}
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
            onChange={(rating) => updateTripRating(trip, rating)}
            readOnly={trip.status !== "completed"}
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
          {trip.startDate ? new Date(trip.startDate).getFullYear() : tbdLabel}
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          {trip.startDate ? formatDate(trip.startDate) : tbdLabel}
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          {trip.endDate ? formatDate(trip.endDate) : tbdLabel}
        </TableCell>
        <TableCell rowSpan={rowSpan}>
          {trip.startDate && trip.endDate ? trip.fullDays : tbdLabel}
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
          <TripActions ref={actionsRef} trip={trip} onEdit={onEdit} />
        </TableCell>
      </>
    </tr>
  );
}
