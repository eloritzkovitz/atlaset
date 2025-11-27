import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { useHighlightYearlyCountries } from "@features/atlas/ui";
import { CountryWithFlag } from "@features/countries";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import type { Country } from "@types";
import { CountryVisitBadge } from "./CountryVisitBadge";

interface CountryListProps {
  countries: Country[];
  selectedIsoCode: string | null;
  hoveredIsoCode: string | null;
  onSelect: (isoCode: string | null) => void;
  onHover: (isoCode: string | null) => void;
  onCountryInfo?: (country: Country) => void;
}

export function CountryList({
  countries,
  selectedIsoCode,
  hoveredIsoCode,
  onSelect,
  onHover,
  onCountryInfo,
}: CountryListProps) {
  const highlightIsoCode = hoveredIsoCode || selectedIsoCode;
  const highlightedIsoCodes = useHighlightYearlyCountries();
  const { selectedYear, years } = useTimeline();
  const { trips } = useTrips();

  // Precompute previous years' visits for efficiency
  const previousYears = years.filter((y) => y < selectedYear);
  const previouslyVisitedIsoCodes = new Set(
    previousYears.flatMap((y) => getVisitedCountriesForYear(trips, y) || [])
  );

  // Precompute visit counts for badges
  const visitCountByIsoCode: Record<string, number> = {};
  years
    .filter((y) => y <= selectedYear)
    .forEach((y) => {
      (getVisitedCountriesForYear(trips, y) || []).forEach((iso) => {
        visitCountByIsoCode[iso] = (visitCountByIsoCode[iso] || 0) + 1;
      });
    });

  return (
    <div className="flex-1 min-h-0 overflow-y-auto -mx-4">
      <div
        className="w-full select-none"
        onMouseLeave={() => {
          onHover(null);
          onSelect(null);
        }}
      >
        <ul className="list-none p-0 m-0 w-full">
          {countries.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-400">
              No countries found
            </li>
          ) : (
            countries.map((country) => {
              const isHighlighted = highlightIsoCode === country.isoCode;
              const isTempHighlight = highlightedIsoCodes.includes(
                country.isoCode
              );

              return (
                <li
                  key={country.isoCode}
                  id={country.isoCode}
                  onClick={() =>
                    onCountryInfo
                      ? onCountryInfo(country)
                      : onSelect(country.isoCode)
                  }
                  onMouseEnter={() => onHover(country.isoCode)}
                  onMouseLeave={() => onHover(null)}
                  className={`px-4 py-2 my-1 rounded cursor-pointer flex items-center gap-3 transition
                    ${
                      isHighlighted
                        ? "bg-blue-50 dark:bg-gray-500 font-bold"
                        : ""
                    }
                    ${isTempHighlight ? "text-yellow-500 font-bold" : ""}
                  `}
                >
                  <CountryWithFlag
                    isoCode={country.isoCode}
                    name={country.name}
                  />
                  {isTempHighlight && (
                    <CountryVisitBadge
                      revisit={previouslyVisitedIsoCodes.has(country.isoCode)}
                      count={visitCountByIsoCode[country.isoCode] || 1}
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
