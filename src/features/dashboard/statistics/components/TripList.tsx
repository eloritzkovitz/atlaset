import { Chip } from "@components";
import { formatDate } from "@utils/date";
import { CountryFlag, useCountryData } from "@features/countries";
import type { Trip } from "@features/trips";
import { getTripDays } from "@features/trips/utils/trips";

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
  const { countries } = useCountryData();

  // Handle empty state
  if (!trips || trips.length === 0) {
    return (
      <ul className={className}>
        <li className="text-muted">—</li>
      </ul>
    );
  }

  return (
    <ul className={className}>
      {trips.map((trip) => (
        <li key={trip.id} className="mt-2 mb-2">
          <Chip className="flex items-center gap-2 px-3 py-2 bg-surface">
            {trip.countryCodes.slice(0, maxFlags).map((code) => {
              const country = countries.find((c) => c.isoCode === code);
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
              <span className="text-muted">| {getTripDays(trip)} days</span>
            )}
            <span className="flex-1" />
            <span className="text-muted text-right min-w-[6.5rem]">
              {trip.startDate ? formatDate(trip.startDate) : ""}
              {trip.endDate ? ` - ${formatDate(trip.endDate)}` : ""}
            </span>
          </Chip>
        </li>
      ))}
    </ul>
  );
}
