import { useState } from "react";
import { useCountryData } from "@contexts/CountryDataContext";
import { useTimeline } from "@contexts/TimelineContext";
import { useTrips } from "@contexts/TripsContext";
import { getVisitedCountriesForYear } from "@features/visits/utils/visits";
import { VisitedCountryNames } from "./VisitedCountryNames";
import {
  CENTER_INDEX,
  YEAR_MARKER_MIN_WIDTH,
  MAX_COUNTRIES_BEFORE_EXPAND,
} from "./constants";

export function TimelineBar() {
  const { countries } = useCountryData();
  const { trips } = useTrips();
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

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

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 px-4 py-2 flex items-center gap-2">
      {/* Timeline line */}
      <div
        className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 opacity-20 rounded"
        style={{ transform: "translateY(-50%)" }}
      />

      {/* Year markers */}
      <div className="flex justify-center gap-4 relative">
        {paddedYears.map((year, idx) => {
          if (year === null)
            return (
              <span key={idx} style={{ minWidth: YEAR_MARKER_MIN_WIDTH }} />
            );

          const visitedIsoCodes =
            getVisitedCountriesForYear(trips, year, undefined) || [];
          const visited = visitedIsoCodes
            .map((code) => countries.find((c) => c.isoCode === code)?.name)
            .filter(Boolean) as string[];

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
              <button
                className="flex flex-col items-center group focus:outline-none"
                style={{ minWidth: YEAR_MARKER_MIN_WIDTH }}
                onClick={() => setSelectedYear(year)}
                aria-label={`Select year ${year}`}
                type="button"
              >
                <span
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition
                    ${year === selectedYear ? "scale-110" : "text-gray-700"}
                  `}
                >
                  <span
                    className={year === selectedYear ? "font-bold" : "text-xs"}
                  >
                    {year}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
