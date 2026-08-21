import { useTranslation } from "react-i18next";
import { Chip, EmptyListMessage } from "@components";
import { useUI } from "@app/contexts/UIContext";
import { CountryFlag, useCountryData } from "@features/countries";
import type { Trip } from "@features/trips/types";
import { getTripDays } from "@features/trips/utils/trips";
import { formatDate } from "@utils";

interface TripListProps {
  trips: Trip[];
  maxFlags?: number;
  className?: string;
  showDuration?: boolean;
}

/** Renders a list of trips with country flags. */
export function TripList({
  trips,
  maxFlags = 3,
  className = "",
  showDuration = false,
}: TripListProps) {
  const { countryByIsoCode } = useCountryData();
  const { t } = useTranslation("dashboard");
  const { handleViewInCalendar } = useUI();

  // Handle empty state
  if (!trips || trips.length === 0) {
    return (
      <EmptyListMessage
        message={t("statistics.overview.noTrips", {
          defaultValue: "No trips available",
        })}
      />
    );
  }

  return (
    <ul className={className}>
      {trips.map((trip) => {
        const isClickable = Boolean(handleViewInCalendar);

        return (
          <li key={trip.id} className="mt-2 mb-2">
            <Chip
              onClick={
                isClickable ? () => handleViewInCalendar(trip) : undefined
              }
              className={`flex items-center gap-2 px-3 py-2 bg-surface ${
                isClickable
                  ? "cursor-pointer hover:bg-surface-hover select-none"
                  : ""
              }`}
            >
              {trip.countryCodes.slice(0, maxFlags).map((code) => {
                const country = countryByIsoCode[code];
                return country ? (
                  <CountryFlag
                    key={code}
                    flag={{
                      isoCode: country.isoCode,
                      sovereignState: country.sovereignState,
                      ratio: "3x2",
                      size: "32",
                    }}
                    className="h-6 w-auto"
                  />
                ) : null;
              })}
              <span className="font-semibold text-base">{trip.name}</span>
              {showDuration && trip.startDate && trip.endDate && (
                <span className="text-muted text-sm">
                  | {getTripDays(trip)}{" "}
                  {t("statistics.overview.days", { defaultValue: "days" })}
                </span>
              )}
              <span className="flex-1" />
              <span className="text-muted text-right text-sm min-w-[6.5rem]">
                {trip.startDate ? formatDate(trip.startDate) : ""}
                {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ""}
              </span>
            </Chip>
          </li>
        );
      })}
    </ul>
  );
}
