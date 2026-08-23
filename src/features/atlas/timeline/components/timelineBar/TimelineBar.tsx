import { useMemo, useState } from "react";
import { useCountryData } from "@features/countries";
import { useLanguage } from "@features/settings/account";
import { useTrips } from "@features/trips";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import { TimelineDot } from "./TimelineDot";
import { VisitedCountryNames } from "./VisitedCountryNames";
import {
  CENTER_INDEX,
  YEAR_MARKER_MIN_WIDTH,
  MAX_COUNTRIES_BEFORE_EXPAND,
} from "../../constants/timeline";
import { useTimeline } from "../../context/TimelineContext";

export function TimelineBar() {
  const { countryByIsoCode } = useCountryData();
  const { trips } = useTrips();
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const { isRtl } = useLanguage();

  const selectedIdx = years.indexOf(selectedYear);
  const total = years.length;

  // Determine start and end indices for slicing
  let start = selectedIdx - CENTER_INDEX;
  let end = selectedIdx + CENTER_INDEX + 1;

  // Calculate how much padding is needed on each side
  let padStart = 0;
  let padEnd = 0;

  if (start < 0) {
    padStart = -start;
    start = 0;
  }

  if (end > total) {
    padEnd = end - total;
    end = total;
  }

  const visibleYears = years.slice(start, end);

  // Pad with nulls for empty spaces
  const paddedYears = [
    ...Array(padStart).fill(null),
    ...visibleYears,
    ...Array(padEnd).fill(null),
  ];

  const visitedCountriesByYear = useMemo(() => {
    return new Map(
      years.map((year) => {
        const codes = getVisitedCountriesForYear(trips, year) ?? [];

        const names = codes
          .map((code) => countryByIsoCode[code]?.name)
          .filter((name): name is string => Boolean(name));

        return [year, names];
      }),
    );
  }, [years, trips, countryByIsoCode]);

  return (
    <div
      className={`absolute bottom-16 start-1/2 transform ${
        isRtl ? "translate-x-1/2" : "-translate-x-1/2"
      } z-20 px-4 py-2 flex items-center gap-2`}
    >
      {/* Timeline line */}
      <div
        className="absolute start-0 end-0 top-1/2 h-1 bg-muted/20 rounded pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Year markers */}
      <div className="absolute flex bottom-3 justify-center gap-4 relative select-none">
        {paddedYears.map((year, idx) => {
          if (year === null) {
            return (
              <span key={idx} style={{ minWidth: YEAR_MARKER_MIN_WIDTH }} />
            );
          }

          const visited = visitedCountriesByYear.get(year) ?? [];

          // Determine if the current year is expanded
          const isExpanded = expandedYear === year;
          const showExpand = visited.length > MAX_COUNTRIES_BEFORE_EXPAND;

          return (
            <div
              key={year}
              className="relative flex flex-col items-center"
              style={{ minWidth: YEAR_MARKER_MIN_WIDTH }}
            >
              <VisitedCountryNames
                names={visited}
                isExpanded={isExpanded}
                showExpand={showExpand}
                onExpand={() => setExpandedYear(year)}
                onCollapse={() => setExpandedYear(null)}
              />

              {/* Year number */}
              <span
                className={`bg-bg/50 rounded-full mb-1 px-2 ${
                  year === selectedYear ? "font-bold" : "font-normal"
                }`}
                style={{ zIndex: 1 }}
                dir="ltr"
              >
                {year}
              </span>

              <TimelineDot
                selected={year === selectedYear}
                onClick={() => setSelectedYear(year)}
                ariaLabel={`Select year ${year}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
