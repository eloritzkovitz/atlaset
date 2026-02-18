import { CountryFlag, useCountryData } from "@features/countries";
import type { Trip } from "@features/trips/types";

interface TripListProps {
  trips: Trip[];
  maxFlags?: number;
  className?: string;
}

/** Renders a list of trips with country flags. */
export function TripList({
  trips,
  maxFlags = 3,
  className = "",
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
        <li key={trip.id} className="mt-4 mb-2 flex items-center gap-2">
          {trip.countryCodes.slice(0, maxFlags).map((code) => {
            const country = countries.find((c) => c.isoCode === code);
            return country ? (
              <CountryFlag
                key={code}
                flag={{
                  isoCode: country.isoCode,
                  ratio: "3x2",
                  size: "32",
                }}
                className="h-6 w-auto"
              />
            ) : null;
          })}
          <span className="font-semibold">{trip.name}</span>
          <span className="text-xs text-muted">
            {trip.startDate ?? ""} {trip.endDate ? `– ${trip.endDate}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
